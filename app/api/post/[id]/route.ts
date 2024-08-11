import Post from '../../../../models/Post';
import { connectMongoDB } from "@/lib/mongodb";
import slugify from '../../../../utils/slugify';
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

interface Params {
  id: string;
}

export const GET = async (req: Request, { params }: { params: Params }) => {
  const { id } = params;
  try {
    await connectMongoDB();
    const post = await Post.findOne({ _id: new ObjectId(id) });

    if (post) {
      return NextResponse.json(post, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
  } catch (error:any) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json({ error: 'Failed to fetch post', message: error.message }, { status: 500 });
  }
};

export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = params;
  try {
    const updatedPost = await request.json();
    await connectMongoDB();

    const result = await Post.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPost }
    );

    if (result.matchedCount > 0) {
      const post = await Post.findOne({ _id: new ObjectId(id) });
      return NextResponse.json(post, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
  } catch (error:any) {
    console.error('Failed to update post:', error);
    return NextResponse.json({ error: 'Failed to update post', message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = params;
  try {
    await connectMongoDB();
    const result = await Post.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
  } catch (error:any) {
    console.error('Failed to delete post:', error);
    return NextResponse.json({ error: 'Failed to delete post', message: error.message }, { status: 500 });
  }
}
