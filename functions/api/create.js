export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        const body = await request.json();
        const id = Math.random().toString(36).substring(2, 8);

        // Simpan Link Asli di Level 10 (Final)
        // Format Key: "game_{ID}_final"
        await env.VIDEO_KV.put(`game_${id}_final`, body.targetUrl);

        // Buat Token Awal (Level 1)
        const token1 = Math.random().toString(36).substring(2);
        await env.VIDEO_KV.put(`game_${id}_1`, token1);

        return new Response(JSON.stringify({ success: true, id: id, token: token1 }), { headers: { "Content-Type": "application/json" } });
    } catch (e) { return new Response("Error", { status: 500 }); }
}
