export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        const body = await request.json();
        if (body.password !== env.ADMIN_PASSWORD) return new Response(JSON.stringify({ error: "Password salah" }), { status: 401 });

        // Buat ID Acak 6 Karakter
        const randomId = Math.random().toString(36).substring(2, 8);

        // Simpan Link Utuh (Video & Download) ke KV
        const videoData = {
            servers: body.servers,      // Array Link Video Utuh
            downloadUrl: body.downloadUrl // Link Download Utuh
        };

        await env.VIDEO_KV.put(`vid_${randomId}`, JSON.stringify(videoData));

        return new Response(JSON.stringify({ success: true, id: randomId }), { headers: { "Content-Type": "application/json" } });
    } catch (err) { return new Response(JSON.stringify({ error: "Error" }), { status: 500 }); }
}
