import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { email }: RequestBody = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const user = await User.findOne({ email }).select("_id");
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the user' }, { status: 500 });
  }
}
