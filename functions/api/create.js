export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        const body = await request.json();
        
        // Buat ID Acak
        const randomId = Math.random().toString(36).substring(2, 8);

        // Hanya simpan data server video
        const videoData = {
            servers: body.servers
        };

        await env.VIDEO_KV.put(`vid_${randomId}`, JSON.stringify(videoData));

        return new Response(JSON.stringify({ success: true, id: randomId }), { 
            headers: { "Content-Type": "application/json" } 
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Gagal membuat data" }), { status: 500 });
    }
}
