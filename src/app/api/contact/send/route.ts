// FILE: src/app/api/contact/send/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, interest, message } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please provide name, email, and message' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Here you would integrate with your email service
    // For now, we'll log the contact form submission
    console.log('📧 New Contact Form Submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Interest:', interest);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toISOString());
    console.log('---');

    // TODO: Integration options:
    // 1. Send via EmailJS (client-side)
    // 2. Send via Nodemailer with SMTP
    // 3. Send via SendGrid API
    // 4. Send via Mailgun API
    // 5. Save to database and send notification

    // For now, simulate a successful send
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time

    return NextResponse.json({
      success: true,
      message: 'Message received! I will get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
