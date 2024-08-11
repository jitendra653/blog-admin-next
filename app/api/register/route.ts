import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const profile = await User.findOne({ email: 'john.doe@example.com' });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error:any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Failed to fetch profile', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password }: UserRegistrationData = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    await connectMongoDB();
    
    const existingUser = await User.findOne({ email }).select("_id");
    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error:any) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { message: "An error occurred while registering the user", error: error.message },
      { status: 500 }
    );
  }
}
