// functions/api/add.js

export async function onRequest(context) {
  const { request, env } = context;

  // 1. Hanya terima request POST
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  // 2. Ambil data dari form
  const { src, download, type, password } = await request.json();

  // 3. Validasi & Cek Password (ambil dari Environment Variable)
  if (password !== env.ADMIN_PASS) {
    return new Response(JSON.stringify({ error: "Invalid password" }), { status: 403 });
  }

  if (!src || !download || !type) {
    return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
  }

  // 4. Generate ID acak, unik, dan pendek
  const newId = Math.random().toString(36).substring(2, 9); // contoh: 'a1b2c3d'

  // 5. Siapkan data untuk disimpan di KV
  const value = JSON.stringify({ src, download, type });

  // 6. Simpan ke KV (Key = ID baru, Value = JSON data)
  await env.VIDEO_STORE.put(newId, value);

  // 7. Beri balasan sukses ke frontend, beserta ID yang baru dibuat
  return new Response(JSON.stringify({ success: true, id: newId }), {
    headers: { "Content-Type": "application/json" },
  });
}
