import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/appwrite";
import { ID } from "node-appwrite";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = String(body.message || "").trim();

    const to = process.env.DEVELOPER_EMAIL || "kasifiit@gmail.com";

    // Attempt to store feedback in Appwrite database if collection configured
    let stored = false;
    try {
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE || process.env.NEXT_APPWRITE_DATABASE;
      const feedbackCollection = process.env.NEXT_APPWRITE_FEEDBACK_COLLECTION || process.env.NEXT_PUBLIC_APPWRITE_FEEDBACK_COLLECTION;

      if (databaseId && feedbackCollection) {
        const { databases } = await createAdminClient();
        await databases.createDocument(databaseId, feedbackCollection, ID.unique(), {
          message,
          createdAt: new Date().toISOString(),
        });
        stored = true;
      } else {
        console.log("Feedback collection not configured, skipping store.");
      }
    } catch (err) {
      console.error("Failed to store feedback in Appwrite:", err);
    }

    // If SMTP configuration provided, try to send using nodemailer
    let emailed = false;
    try {
      const host = process.env.SMTP_HOST;
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;

      if (host && user && pass) {
        const transporter = nodemailer.createTransport({
          host,
          port: port || 587,
          secure: port === 465,
          auth: {
            user,
            pass,
          },
        });

        await transporter.sendMail({
          from: `Feedback <${user}>`,
          to,
          subject: "User feedback from app",
          text: message,
          html: `<p>${message}</p>`,
        });

        emailed = true;
      } else {
        console.log("SMTP not configured, skipping email send.");
      }
    } catch (err) {
      console.error("Failed to send feedback email:", err);
    }

    return NextResponse.json({ ok: true, stored, emailed });
  } catch (error) {
    console.error("Failed to handle feedback request", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
