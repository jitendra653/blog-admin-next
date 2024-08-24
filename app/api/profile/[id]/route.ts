import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

interface UpdatedUser {
  email?: string;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    await connectMongoDB();
    const profile = await User.findOne({ _id: new ObjectId(id) });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error:any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Failed to fetch profile', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const updatedUser: UpdatedUser = await req.json();

    await connectMongoDB();

    const existingUser = await User.findOne({
      "_id": { $ne: new ObjectId(id) },
      "email": updatedUser.email
    }).select("_id");

    if (existingUser) {
      return NextResponse.json({ message: "This email already exists." }, { status: 409 });
    }

    const result = await User.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );

    if (result.matchedCount > 0) {
      return NextResponse.json(updatedUser, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error:any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Failed to update user', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    await connectMongoDB();

    const result = await User.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error:any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Failed to delete user', error: error.message }, { status: 500 });
  }
}
