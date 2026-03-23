import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};


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

    // Use service role to call the RPC (since anon no longer has EXECUTE)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

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
