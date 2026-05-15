import dbConnect from '@/lib/mongodb'
import Message from '@/models/Message'

export async function POST(req) {
  try {
    await dbConnect()
    
    const body = await req.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return Response.json({ error: 'كل الحقول مطلوبة' }, { status: 400 })
    }

    const newMessage = await Message.create({ name, email, message })
    
    return Response.json({ success: true, data: newMessage }, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'حصل خطأ في السيرفر' }, { status: 500 })
  }
}
