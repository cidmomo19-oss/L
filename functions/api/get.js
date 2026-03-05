export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) return new Response(JSON.stringify({ error: "No ID" }), { status: 400 });

    const targetUrl = await env.VIDEO_KV.get(`taptap_${id}`);

    if (!targetUrl) return new Response(JSON.stringify({ error: "Link Expired" }), { status: 404 });

    return new Response(JSON.stringify({ url: targetUrl }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
}
