import { connectMongoDB } from "@/lib/mongodb";
import Newsletter from '@/models/Newsletter';
import { NextRequest, NextResponse } from 'next/server';

interface NewsletterFormData {
  email: string;
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const newsletterData = await Newsletter.find();
    if (newsletterData.length === 0) {
      return NextResponse.json({ message: 'No Newsletter Data found' }, { status: 404 });
    }
    return NextResponse.json(newsletterData, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching newsletterData:', error);
    return NextResponse.json({ message: 'Failed to fetch newsletterData', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectMongoDB();
  try {
    const {  email }: NewsletterFormData = await req.json();
    await Newsletter.create({email});
    return NextResponse.json({
      success: true, data: {
        email
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}