import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

interface UserData {
  name: string;
  status: string;
  password: string;
  role: string;
  email: string;
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const profiles = await User.find();

    if (profiles.length === 0) {
      return NextResponse.json({ message: 'No profiles found' }, { status: 404 });
    }

    return NextResponse.json(profiles, { status: 200 });
  } catch (error:any) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ message: 'Failed to fetch profiles', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, status, password, role, email }: UserData = await req.json();
    await connectMongoDB();

    const existingUser = await User.findOne({ email }).select("_id");
    if (existingUser) {
      return NextResponse.json({ message: "This email already exists." }, { status: 409 });
    }

    await User.create({ name, status, password, role, email });
    return NextResponse.json({ message: "User saved successfully." }, { status: 201 });
  } catch (error:any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'An error occurred while registering the user', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { name, status, role, email, password }: Partial<UserData> = await req.json();
    await connectMongoDB();

    const updatedProfile = await User.findOneAndUpdate(
      { email },
      { $set: { name, status, password, role, email } },
      { returnDocument: 'after' }
    );

    if (!updatedProfile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error:any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Failed to update profile', error: error.message }, { status: 500 });
  }
}
