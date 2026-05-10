import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'مصطفى محمود عيسى' },
  title: { type: String, default: 'مصمم مواقع' },
  whatsapp: { type: String, default: '01044907363' },
})
export default mongoose.models.User || mongoose.model('User', UserSchema)
