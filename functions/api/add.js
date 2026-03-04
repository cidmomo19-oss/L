// functions/api/add.js

export async function onRequest(context) {
  const { request, env } = context;

  // --- SETTING PASSWORD DISINI ---
  const PASSWORD_ADMIN_GW = "12345"; // Ganti "12345" dengan password mau lu apa
  // -------------------------------

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const { servers, download, password } = await request.json();

  // Cek password langsung ke variabel di atas
  if (password !== PASSWORD_ADMIN_GW) {
    return new Response(JSON.stringify({ error: "Password Salah, Banh!" }), { status: 403 });
  }

  if (!servers || !Array.isArray(servers) || servers.length === 0) {
    return new Response(JSON.stringify({ error: "Minimal harus ada satu server." }), { status: 400 });
  }
  
  if (!download) {
     return new Response(JSON.stringify({ error: "Link download wajib diisi." }), { status: 400 });
  }

  const newId = Math.random().toString(36).substring(2, 9);
  const value = JSON.stringify({ servers, download });

  await env.VIDEO_STORE.put(newId, value);

  return new Response(JSON.stringify({ success: true, id: newId }), {
    headers: { "Content-Type": "application/json" },
  });
}
