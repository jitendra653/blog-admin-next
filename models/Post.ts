import mongoose, { Document, Model, Schema } from 'mongoose';

interface IPost extends Document {
  title: string;
  slug: string;
  image: string;
  category?: string;
  tags?: string[];
  description: string;
  content?: string;
  status: string;
}

const PostSchema: Schema<IPost> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    tags: {
      type: [String],
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;



