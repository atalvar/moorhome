/// <reference path="./types.d.ts" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.2";

declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response> | Response): void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

async function sendReservationEmails({
  customerName,
  customerEmail,
  customerPhone,
  customerAddress,
  reservationId,
  items,
}: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string | null;
  reservationId: string;
  items: Array<{ product_id: string; delivery_method: string }>;
}) {
  const gmailUser = Deno.env.get("GMAIL_USER");
  const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");
  const adminEmails = getConfiguredAdminEmails();
  const fromName = Deno.env.get("GMAIL_FROM_NAME") || "Moorhome";
  const configuredFromAddress = Deno.env.get("GMAIL_FROM_ADDRESS");
  // Gmail SMTP deliverability is better when the From mailbox matches the authenticated account.
  const fromAddress = gmailUser;
  const replyToAddress = Deno.env.get("GMAIL_REPLY_TO") || adminEmails[0] || gmailUser;
  const adminRecipients = adminEmails.length > 0
    ? adminEmails
    : (fromAddress ? [fromAddress] : []);

  if (!gmailUser || !gmailAppPassword) {
    console.info("Reservation email skipped because Gmail SMTP is not configured.");
    return null;
  }

  const itemSummary = items
    .map((item) => `${item.product_id} (${item.delivery_method})`)
    .join(", ");

  const customerText = `Hello ${customerName},\n\nYour reservation has been received. This email is your confirmation and receipt.\n\nReservation ID: ${reservationId}\nEmail: ${customerEmail}\nPhone: ${customerPhone}${customerAddress ? `\nAddress: ${customerAddress}` : ""}\nItems: ${itemSummary}\n\nWe will contact you shortly with the next steps.\n\nThank you,\n${fromName}`;

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="margin-bottom: 8px;">Ostu kinnitus</h2>
      <p>Hello ${customerName},</p>
      <p>Your reservation has been received. This email is your confirmation and receipt.</p>
      <p><strong>Reservation ID:</strong> ${reservationId}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Phone:</strong> ${customerPhone}</p>
      ${customerAddress ? `<p><strong>Address:</strong> ${customerAddress}</p>` : ""}
      <p><strong>Items:</strong> ${itemSummary}</p>
      <p>We will contact you shortly with the next steps.</p>
      <p style="margin-top: 16px;">Thank you,<br />${fromName}</p>
    </div>
  `;

  const adminText = `New reservation received\n\nReservation ID: ${reservationId}\nCustomer: ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone}${customerAddress ? `\nAddress: ${customerAddress}` : ""}\nItems: ${itemSummary}`;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="margin-bottom: 8px;">New reservation received</h2>
      <p>A new reservation has been created.</p>
      <p><strong>Reservation ID:</strong> ${reservationId}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Phone:</strong> ${customerPhone}</p>
      ${customerAddress ? `<p><strong>Address:</strong> ${customerAddress}</p>` : ""}
      <p><strong>Items:</strong> ${itemSummary}</p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  await transporter.sendMail({
    from: `${fromName} <${fromAddress}>`,
    replyTo: configuredFromAddress || replyToAddress,
    envelope: {
      from: gmailUser,
      to: customerEmail,
    },
    to: customerEmail,
    subject: `Reservation confirmation #${reservationId}`,
    text: customerText,
    html: customerHtml,
  });

  if (adminRecipients.length > 0) {
    console.info("Admin recipients resolved for reservation notification:", adminRecipients);
  }

  if (adminRecipients.length > 0) {
    const uniqueRecipients = Array.from(new Set(adminRecipients.map((email) => email.toLowerCase())));
    const failedRecipients: string[] = [];

    for (const recipient of uniqueRecipients) {
      try {
        await transporter.sendMail({
          from: `${fromName} <${fromAddress}>`,
          replyTo: replyToAddress,
          to: recipient,
          subject: `New reservation received #${reservationId}`,
          text: adminText,
          html: adminHtml,
        });
        console.info(`Admin reservation email sent to ${recipient}`);
      } catch (adminEmailError) {
        failedRecipients.push(recipient);
        console.error(`Failed to send admin reservation email to ${recipient}:`, adminEmailError);
      }
    }

    if (failedRecipients.length === uniqueRecipients.length) {
      throw new Error("Failed to send reservation email to all admin recipients.");
    }
  } else {
    console.info("Admin reservation email skipped because no recipient was configured.");
  }

  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    // Use service role client for all DB operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // DB-based distributed rate limiting
    const { data: isLimited, error: rlError } = await supabase.rpc("check_rate_limit", { p_ip: ip });
    if (rlError) {
      console.error("Rate limit check error:", rlError.message);
    }
    if (isLimited) {
      return new Response(
        JSON.stringify({ error: "Liiga palju päringuid. Proovi hiljem uuesti." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { customer_name, customer_email, customer_phone, customer_address, items } = body;

    // Basic server-side validation
    if (!customer_name || !customer_email || !customer_phone || !items?.length) {
      return new Response(
        JSON.stringify({ error: "Puuduvad kohustuslikud väljad" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }


    const { data, error } = await supabase.rpc("create_reservation", {
      p_customer_name: customer_name,
      p_customer_email: customer_email,
      p_customer_phone: customer_phone,
      p_customer_address: customer_address || null,
      p_items: items,
    });

    if (error) {
      console.error("Reservation error:", error.message);
      // Map known errors to safe user-facing messages
      let safeMessage = "Tellimust ei saanud luua. Proovi uuesti.";
      if (error.message.includes("already reserved")) {
        safeMessage = "Üks või mitu toodet ei ole enam saadaval.";
      } else if (error.message.includes("Item count")) {
        safeMessage = "Lubamatu toodete arv.";
      } else if (error.message.includes("Invalid email")) {
        safeMessage = "Vigane e-posti aadress.";
      } else if (error.message.includes("Phone must be")) {
        safeMessage = "Vigane telefoninumber.";
      } else if (error.message.includes("Customer name")) {
        safeMessage = "Vigane nimi.";
      } else if (error.message.includes("Address must be")) {
        safeMessage = "Aadress on liiga pikk.";
      }
      return new Response(
        JSON.stringify({ error: safeMessage }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      await sendReservationEmails({
        customerName: customer_name,
        customerEmail: customer_email,
        customerPhone: customer_phone,
        customerAddress: customer_address || null,
        reservationId: String(data),
        items: items.map((item: { product_id: string; delivery_method: string }) => ({
          product_id: item.product_id,
          delivery_method: item.delivery_method,
        })),
      });
    } catch (emailError) {
      console.error("Reservation email error:", emailError);
    }

    return new Response(
      JSON.stringify({ reservation_id: data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Serveri viga" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
