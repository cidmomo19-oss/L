export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        
        // BAGIAN CEK PASSWORD SUDAH DIHAPUS

        // Generate ID Acak
        const randomId = Math.random().toString(36).substring(2, 8);

        const videoData = {
            servers: body.servers,
            downloadUrl: body.downloadUrl
        };

        await env.VIDEO_KV.put(`vid_${randomId}`, JSON.stringify(videoData));

        return new Response(JSON.stringify({ success: true, id: randomId }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
    }
}
