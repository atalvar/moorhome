import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Find user by current email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return new Response(JSON.stringify({ error: listError.message }), { status: 500 });

  const user = users.find(u => u.email === 'ando@moorhome.ee');
  if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

  // Update email
  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    email: 'ando.talvar@moorhome.ee',
    email_confirm: true,
  });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ success: true, message: 'Email updated to ando.talvar@moorhome.ee' }));
});
