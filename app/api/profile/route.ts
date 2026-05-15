import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(req: NextRequest) {
  const data = Object.fromEntries(await req.formData());
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  await client.db().collection('profile').updateOne({}, { $set: data }, { upsert: true });
  client.close();
  return NextResponse.redirect(new URL('/admin/profile', req.url));
}
