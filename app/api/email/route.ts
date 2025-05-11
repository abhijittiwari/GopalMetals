import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { WebsiteSettings } from '@/lib/settings';

// Simple in-memory store for rate limiting
// In production, use Redis or another external store
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 submissions per hour per IP
const ipRequestMap = new Map<string, { count: number; timestamp: number }>();

// Email validation with regex
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const now = Date.now();
    const ipRequest = ipRequestMap.get(ip);
    
    if (ipRequest) {
      // Reset if window has passed
      if (now - ipRequest.timestamp > RATE_LIMIT_WINDOW) {
        ipRequestMap.set(ip, { count: 1, timestamp: now });
      } else if (ipRequest.count >= MAX_REQUESTS_PER_WINDOW) {
        // Too many requests
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      } else {
        // Increment count
        ipRequestMap.set(ip, { count: ipRequest.count + 1, timestamp: ipRequest.timestamp });
      }
    } else {
      // First request from this IP
      ipRequestMap.set(ip, { count: 1, timestamp: now });
    }

    const data = await request.json();
    const { name, email, phone, company = 'Not provided', message, subject, honeypot, recaptchaToken } = data;
    
    // Check honeypot field (bots will fill this invisible field)
    if (honeypot) {
      // Silently reject bot submissions but return success so bots think it worked
      return NextResponse.json(
        { success: true, message: 'Submission received' },
        { status: 200 }
      );
    }
    
    // Validate reCAPTCHA token if enabled
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!recaptchaToken) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed' },
          { status: 400 }
        );
      }
      
      // Verify with Google's reCAPTCHA API
      const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
      });
      
      const recaptchaData = await recaptchaResponse.json();
      
      // Check if score is above threshold (0.5 is recommended by Google)
      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed' },
          { status: 400 }
        );
      }
    }
    
    // Validate the required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Create a transporter with SMTP configuration from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: process.env.EMAIL_SERVER_PORT === '465',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Get recipient emails from settings or environment variable
    let recipientEmails = process.env.CONTACT_FORM_RECIPIENTS?.split(',') || ['info@gopalmetals.com'];
    try {
      const settingsRecord = await prisma.settings.findFirst({
        where: { id: 1 },
      });
      
      if (settingsRecord && settingsRecord.data) {
        const settings: WebsiteSettings = JSON.parse(settingsRecord.data);
        if (settings.contactInfo?.contactFormEmails && 
            settings.contactInfo.contactFormEmails.length > 0) {
          recipientEmails = settings.contactInfo.contactFormEmails;
        }
      }
    } catch (settingsError) {
      console.error('Error fetching contact form emails from settings:', settingsError);
      // Continue with environment variable emails if settings fetch fails
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'website@gopalmetals.com',
      to: recipientEmails.join(', '),
      replyTo: email,
      subject: `New Contact Form Submission: ${subject || 'Website Inquiry'} from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company}
Subject: ${subject || 'Website Inquiry'}

Message:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4f46e5;">New Contact Form Submission</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; width: 120px;"><strong>Name:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${phone || 'Not provided'}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Company:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${company}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${subject || 'Website Inquiry'}</td>
    </tr>
  </table>
  <div style="margin-top: 20px;">
    <h3 style="color: #4f46e5;">Message:</h3>
    <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 15px; border-radius: 5px;">${message}</p>
  </div>
</div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Log the submission to database
    try {
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          phone: phone || null,
          company: company || null,
          subject: subject || 'Website Inquiry',
          message,
          ipAddress: ip,
        },
      });
    } catch (err: any) {
      // Don't fail if logging fails, just continue
      console.error('Error logging contact submission:', err);
    }

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 