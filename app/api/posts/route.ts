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
    const posts = await Post.find({ status: { $ne: "Draft" } }).sort({ _id: -1 });
    const response = NextResponse.json(posts, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    return response;
  } catch (error:any) {
    console.error('Failed to fetch posts:', error);
    const response = NextResponse.json({ error: 'Failed to fetch posts', message: error.message }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    return response;
  }
};
