export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "No ID" }), { status: 400 });

    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    let response = await cache.match(cacheKey);

    if (!response) {
        const data = await env.VIDEO_KV.get(`vid_${id}`);
        if (!data) return new Response(JSON.stringify({ error: "Not Found" }), { status: 404 });

        response = new Response(data, {
            headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=2592000, s-maxage=2592000", "Access-Control-Allow-Origin": "*" }
        });
        context.waitUntil(cache.put(cacheKey, response.clone()));
    }
    return response;
}
