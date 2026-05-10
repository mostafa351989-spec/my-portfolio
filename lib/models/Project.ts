import mongoose from 'mongoose'
const ProjectSchema = new mongoose.Schema({
  title: String,
  category: { type: String, enum: ['design','3d','ui'] },
  tags: [String],
  link: String,
})
export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)
