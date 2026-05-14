import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  try {
    return jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
  } catch {
    return null;
  }
}

export async function GET(request) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const filter = searchParams.get('filter');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('contacts');

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    if (status === 'unread') query.isRead = { $ne: true };
    if (status === 'read') query.isRead = true;

    const now = new Date();
    if (filter === 'today') {
      query.createdAt = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
    } else if (filter === 'week') {
      query.createdAt = { $gte: new Date(now.setDate(now.getDate() - 7)) };
    }

    const messages = await collection.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

    const totalCount = await collection.countDocuments(query);
    const unreadCount = await collection.countDocuments({ isRead: { $ne: true } });

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      const count = await collection.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });
      chartData.push({
        date: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
        count
      });
    }

    const stats = {
      total: await collection.countDocuments(),
      today: await collection.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      week: await collection.countDocuments({
        createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
      }),
      unread: unreadCount
    };

    return NextResponse.json({
      messages,
      stats,
      chartData,
      pagination: { page, limit, total: totalCount, pages: Math.ceil(totalCount / limit) }
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PATCH(request) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await request.json();
  try {
    await client.connect();
    const db = client.db();
    await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isRead: true } }
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(request) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    await client.connect();
    const db = client.db();
    await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
