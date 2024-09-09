import Post from '../../../models/Post';
import { connectMongoDB } from "@/lib/mongodb";
import slugify from '../../../utils/slugify';
import { NextRequest, NextResponse } from "next/server";

interface PostData {
  title: string;
  description: string;
  image: string;
  content: string;
  category: string;
  tags: string[];
  status :string
}

export const GET = async (req: NextRequest) => {
  try {
    await connectMongoDB();
    const posts = await Post.find({status: {$ne :"Draft"}});
    return NextResponse.json(posts, { status: 200 });
  } catch (error:any) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts', message: error.message }, { status: 500 });
  }
};
