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
    const response=  NextResponse.json({
      success: true, data: {
        email
      }
    }, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    return response;
  } catch (error) {
    const response= NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    return response;
  }
}

export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return new NextResponse(null, { status: 204, headers });
}