import { NextRequest, NextResponse } from "next/server";
const OneSignal = require('onesignal-node');    

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_ID as string; // Replace with your OneSignal App ID
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_API_KEY as string; // Replace with your OneSignal API Key

// Initialize OneSignal Client
const client = new OneSignal.Client(ONESIGNAL_APP_ID, ONESIGNAL_REST_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, subject, content } = await req.json();

    // Send Email via OneSignal
    const response = await client.createNotification({
      app_id:ONESIGNAL_APP_ID,
      email_subject: subject,
      email_body: content,
      include_email_tokens: [email], // Send email to a specific user
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({ success: false});
  }
}
