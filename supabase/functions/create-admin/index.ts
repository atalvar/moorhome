import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email, password, admin_secret } = body ?? {};

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const expectedSecret = Deno.env.get("BOOTSTRAP_ADMIN_SECRET");
    if (expectedSecret && admin_secret && admin_secret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: "Invalid admin secret." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error("User list failed", listError);
      return new Response(
        JSON.stringify({ error: "Could not inspect existing users." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const existingUser = existingUsers.users.find((user: any) => user.email === email);
    let userId = existingUser?.id;

    if (!existingUser) {
      const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { is_admin_bootstrap: true },
      });

      if (createError || !createdUser?.user) {
        console.error("Admin user creation failed", createError);
        return new Response(
          JSON.stringify({ error: "Could not create admin user." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      userId = createdUser.user.id;
    }

    const { data: existingRole, error: roleSelectError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (roleSelectError) {
      console.error("Admin role lookup failed", roleSelectError);
      return new Response(
        JSON.stringify({ error: "Admin role assignment failed." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let roleError;
    if (existingRole) {
      ({ error: roleError } = await supabase.from("user_roles").update({ role: "admin" }).eq("user_id", userId));
    } else {
      ({ error: roleError } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" }));
    }

    if (roleError) {
      console.error("Admin role assign failed", roleError);
      return new Response(
        JSON.stringify({ error: "Admin role assignment failed." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message: existingUser ? "Admin role assigned to existing account." : "Admin account created successfully.",
        email,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Create admin failed", err);
    return new Response(
      JSON.stringify({ error: "Server error while creating admin account." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
