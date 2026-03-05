export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) return new Response(JSON.stringify({ error: "No ID" }), { status: 400 });

    // Key untuk interaksi
    const key = `int_${id}`;

    // --- GET: Ambil Data Like & Komen ---
    if (request.method === "GET") {
        let data = await env.VIDEO_KV.get(key, { type: "json" });
        if (!data) data = { likes: 0, comments: [] };

        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }

    // --- POST: Kirim Like atau Komen ---
    if (request.method === "POST") {
        try {
            const body = await request.json();
            let data = await env.VIDEO_KV.get(key, { type: "json" });
            if (!data) data = { likes: 0, comments: [] };

            if (body.type === 'like') {
                data.likes = (data.likes || 0) + 1;
            } 
            else if (body.type === 'comment') {
                // Simpan komen baru (Nama, Pesan, Waktu)
                const newComment = {
                    name: body.name || "Anonim",
                    text: body.text,
                    date: new Date().toISOString()
                };
                // Tambahkan ke awal array (biar paling baru di atas)
                data.comments.unshift(newComment);
                
                // Batasi maksimal 50 komen biar KV ga berat
                if (data.comments.length > 50) data.comments.pop();
            }

            await env.VIDEO_KV.put(key, JSON.stringify(data));

            return new Response(JSON.stringify({ success: true, data: data }), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            return new Response(JSON.stringify({ error: "Error writing" }), { status: 500 });
        }
    }
}
