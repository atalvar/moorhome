import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const emails = users.map(u => ({ id: u.id, email: u.email }));
  
  // Try to find and update the admin user
  const admin = users.find(u => u.email?.includes('ando') || u.email?.includes('moorhome'));
  if (admin) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(admin.id, {
      email: 'ando.talvar@moorhome.ee',
      email_confirm: true,
    });
    if (updateError) return new Response(JSON.stringify({ error: updateError.message, emails }), { status: 500 });
    return new Response(JSON.stringify({ success: true, old_email: admin.email, new_email: 'ando.talvar@moorhome.ee' }));
  }

  return new Response(JSON.stringify({ users: emails }));
});
