export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        const body = await request.json();
        const randomId = Math.random().toString(36).substring(2, 8); // ID Acak

        // Simpan Link Tujuan ke KV
        await env.VIDEO_KV.put(`taptap_${randomId}`, body.targetUrl);

        return new Response(JSON.stringify({ success: true, id: randomId }), { 
            headers: { "Content-Type": "application/json" } 
        });
    } catch (err) { return new Response(JSON.stringify({ error: "Gagal" }), { status: 500 }); }
}
