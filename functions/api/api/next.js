export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        const body = await request.json();
        const { id, currentToken, currentLevel } = body;

        // 1. Cek Apakah Token Level Saat Ini Valid di KV?
        const validToken = await env.VIDEO_KV.get(`game_${id}_${currentLevel}`);

        if (!validToken || validToken !== currentToken) {
            return new Response(JSON.stringify({ error: "Curang ya bos? Ulang lagi!" }), { status: 403 });
        }

        // 2. Jika Level Belum 10, Buat Token Baru untuk Level Berikutnya
        if (currentLevel < 10) {
            const nextLevel = currentLevel + 1;
            const nextToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
            
            // Simpan Token Level Baru ke KV (Hanya user yang sah yang tau ini)
            await env.VIDEO_KV.put(`game_${id}_${nextLevel}`, nextToken);

            // Hapus Token Lama (Opsional, biar gak bisa dipake mundur)
            await env.VIDEO_KV.delete(`game_${id}_${currentLevel}`);

            return new Response(JSON.stringify({ nextLevel: nextLevel, nextToken: nextToken }), { 
                headers: { "Content-Type": "application/json" } 
            });
        } 
        
        // 3. Jika Sudah Level 10 (Final), Kasih Link Asli
        else {
            const finalLink = await env.VIDEO_KV.get(`game_${id}_final`);
            return new Response(JSON.stringify({ finalLink: finalLink }), { 
                headers: { "Content-Type": "application/json" } 
            });
        }

    } catch (e) { return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 }); }
}
