// models/Contact.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
