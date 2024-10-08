import type { NextApiRequest, NextApiResponse } from 'next';
import { connectMongoDB } from "@/lib/mongodb";
import Contact from '@/models/Contact';
import { sendToTelegram } from '@/lib/sendtotelegram'
import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const contactData = await Contact.find();
    if (contactData.length === 0) {
      return NextResponse.json({ message: 'No Contact Data found' }, { status: 404 });
    }
    return NextResponse.json(contactData, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching contactData:', error);
    return NextResponse.json({ message: 'Failed to fetch contactData', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectMongoDB();
  try {
    const { name, email, phone, subject, message }: ContactFormData = await req.json();
    await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });
    const telegramMessage = `
📩 *New Contact Form Submission* 📩

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Subject:* ${subject}
*Message:* ${message}
    `;
    await sendToTelegram(telegramMessage);
    const response =  NextResponse.json({
      success: true, data: {
        name,
        email,
        phone,
        subject,
        message,
      }
    }, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    return response;
  } catch (error) {
    const response = NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
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