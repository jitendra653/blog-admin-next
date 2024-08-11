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
    const posts = await Post.find({});
    return NextResponse.json(posts, { status: 200 });
  } catch (error:any) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts', message: error.message }, { status: 500 });
  }
};

export async function POST(req: NextRequest) {
  try {
    const { title, description, image, content, category, tags,status }: PostData = await req.json();
    await connectMongoDB();
    const slug = await slugify(title);

    await Post.create({
      title,
      slug,
      description,
      content,
      image,
      category,
      tags,
      status
    });

    return NextResponse.json({ message: "Post saved." }, { status: 201 });
  } catch (error:any) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: error.message, message: "An error occurred while saving the post." }, { status: 500 });
  }
}
