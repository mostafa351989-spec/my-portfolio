import mongoose from 'mongoose';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();
    
    if (!process.env.MONGODB_URI) {
      return Response.json({ error: 'MONGODB_URI not set' }, { status: 500 });
    }
    
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'portfolio' });
    
    const ContactSchema = new mongoose.Schema({
      name: String,
      email: String, 
      subject: String,
      message: String,
      date: { type: Date, default: Date.now }
    });
    
    const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
    await Contact.create({ name, email, subject, message });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('MongoDB Error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
