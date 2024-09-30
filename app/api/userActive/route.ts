import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
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
    const userexits = await User.findOne({ email, status: 'active' }).select('_id')
    if (userexits) {
      const user = await User.findOne({ email, status: 'active' }).select('_id')
      if (!user) {
        return NextResponse.json({ message: 'This Account is inActive', active: false, userExits:true }, { status: 404 })
      } else {
        return NextResponse.json({ user, userExits: true, active:true })
      }
    }
    return NextResponse.json({ message: 'Account not found for this email',userExits : false }, { status: 404 })
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the user' }, { status: 500 });
  }
}
