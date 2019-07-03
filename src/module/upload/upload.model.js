import mongoose, { Schema } from 'mongoose';

const UploadSchema = new Schema({
  filename: {
    type: String,
    required: [true, 'Filename is required.'],
    trim: true,
  },
  originalname: String,
  encoding: String,
  mimetype: String,
  size: Number,
  path: String,
  thumbPath: String,
  user: {
    type: Schema.Types.ObjectId,
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Upload', UploadSchema);
