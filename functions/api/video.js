// functions/api/video.js

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "ID Missing" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await env.VIDEO_STORE.get(id, { type: "json" });

  if (!data) {
    return new Response(JSON.stringify({ error: "Video Not Found" }), { 
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- BAGIAN PENTING UNTUK CACHING MAKSIMAL ---
  const cacheHeaders = {
    "Content-Type": "application/json",
    // Perintah caching untuk Browser dan Cloudflare
    // s-maxage adalah perintah KHUSUS untuk shared cache seperti CDN Cloudflare
    "Cache-Control": "public, max-age=86400, s-maxage=2592000", // Cache di Browser 1 hari, di CDN 30 hari
    // Memberi tahu Cloudflare untuk meng-cache response ini
    "CDN-Cache-Control": "public, max-age=2592000",
  };

  return new Response(JSON.stringify(data), {
    headers: cacheHeaders,
  });
}
