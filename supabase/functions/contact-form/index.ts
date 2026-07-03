/// <reference path="../create-reservation/types.d.ts" />

import nodemailer from "npm:nodemailer@6.9.2";

declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response> | Response): void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getConfiguredAdminEmails() {
  const configured = Deno.env.get("GMAIL_ADMIN_EMAIL") || Deno.env.get("ADMIN_EMAIL");
  if (!configured) return [];

  return configured
    .split(/[;,\s]+/)
    .map((token) => token.trim())
    .map((token) => token.replace(/^[\[{(<\"'\s]+/, "").replace(/[\]})>\"'\s]+$/, ""))
    .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}

async function sendContactEmail({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const gmailUser = Deno.env.get("GMAIL_USER");
  const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");
  const adminEmails = getConfiguredAdminEmails();
  const fromName = Deno.env.get("GMAIL_FROM_NAME") || "Moorhome";
  const fromAddress = Deno.env.get("GMAIL_FROM_ADDRESS") || gmailUser;
  const replyToAddress = Deno.env.get("GMAIL_REPLY_TO") || email || gmailUser;

  if (!gmailUser || !gmailAppPassword || adminEmails.length === 0) {
    console.info("Contact email skipped because Gmail SMTP or admin email is not configured.");
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  const text = `New contact form submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nSubject: ${subject}\n\nMessage:\n${message}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="margin-bottom: 8px;">New contact form submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "-"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <div style="margin-top: 12px;"><strong>Message:</strong><br />${message.replace(/\n/g, "<br />")}</div>
    </div>
  `;

  await transporter.sendMail({
    from: `${fromName} <${fromAddress}>`,
    replyTo: replyToAddress,
    to: adminEmails,
    subject: `Contact form: ${subject}`,
    text,
    html,
  });

  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body || {};

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: "Unable to send message right now" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
