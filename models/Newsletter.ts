// models/Newsletter.ts
import mongoose, { Document, Schema } from 'mongoose';

interface INewsletter extends Document {
  email: string;
}

const NewsletterSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
