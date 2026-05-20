import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, restaurantName, message } = body;

    if (!firstName || !email || !restaurantName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'Cevop <hello@cevop.com>',
      to: 'hello@cevop.com',
      replyTo: email,
      subject: `Demo request from ${restaurantName}`,
      html: `
        <h2>New demo request</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Restaurant:</strong> ${restaurantName}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message provided'}</p>
      `,
    });

    // Send confirmation to the prospect
    await resend.emails.send({
      from: 'Cevop <hello@cevop.com>',
      to: email,
      subject: `We'll be in touch, ${firstName}`,
      html: `
        <p>Hi ${firstName},</p>
        <p>Thanks for reaching out. We've received your demo request for ${restaurantName} and will be in touch within one business day.</p>
        <p>In the meantime, you can <a href="https://app.cevop.com/signup">start your free plan</a> right now — no credit card required.</p>
        <p>— The Cevop team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}
