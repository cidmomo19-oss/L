// functions/api/add.js

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const { servers, download, password } = await request.json();

  if (password !== env.ADMIN_PASS) {
    return new Response(JSON.stringify({ error: "Invalid password" }), { status: 403 });
  }

  // Validasi baru: pastikan 'servers' adalah array dan tidak kosong
  if (!servers || !Array.isArray(servers) || servers.length === 0) {
    return new Response(JSON.stringify({ error: "Minimal harus ada satu server." }), { status: 400 });
  }
  
  if (!download) {
     return new Response(JSON.stringify({ error: "Link download wajib diisi." }), { status: 400 });
  }

  const newId = Math.random().toString(36).substring(2, 9);

  // Simpan struktur data baru yang berisi array 'servers'
  const value = JSON.stringify({ servers, download });

  await env.VIDEO_STORE.put(newId, value);

  return new Response(JSON.stringify({ success: true, id: newId }), {
    headers: { "Content-Type": "application/json" },
  });
}
