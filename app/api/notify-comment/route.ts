import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const { name, text, parentType } = await request.json();

  const resend = new Resend(process.env.RESEND_API_KEY!);

  await resend.emails.send({
    from: "noreply@ireviewstuff.com",
    to: "paul@ireviewstuff.com",
    subject: `New comment on ${parentType}`,
    html: `
      <h2>New comment</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Comment:</strong> ${text}</p>
    `,
  });

  return NextResponse.json({ success: true });
}