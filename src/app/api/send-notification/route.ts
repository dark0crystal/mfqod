// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { title, message, userId } = await req.json();

//     // Replace with your OneSignal App ID & API Key
//     const ONESIGNAL_APP_ID = "a20918ee-ab25-4dbd-951e-6bf0763799dd";
//     // const ONESIGNAL_API_KEY = "your-rest-api-key";

//     const response = await fetch("https://onesignal.com/api/v1/notifications", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // "Authorization": `Basic ${ONESIGNAL_API_KEY}`,
//       },
//       body: JSON.stringify({
//         app_id: ONESIGNAL_APP_ID,
//         include_external_user_ids: [userId], // Send to a specific user
//         contents: { en: message },
//         headings: { en: title },
//       }),
//     });

//     if (!response.ok) throw new Error("Failed to send notification");

//     const data = await response.json();
//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message});
//   }
// }
