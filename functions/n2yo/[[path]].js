// Cloudflare Pages Function: production version of src/setupProxy.js.
// Set N2YO_API_KEY under Settings > Environment variables in the Pages project.
//
// Only the two endpoints the app uses are forwarded, and only numeric path
// segments are accepted, so the key can't be used as an open proxy.
const ALLOWED = new Set(["above", "positions"]);
const NUMBER = /^-?\d+(\.\d+)?$/;

export async function onRequestGet({ params, env }) {
  const [endpoint, ...args] = (params.path || []).filter(Boolean);

  if (!ALLOWED.has(endpoint) || !args.every((a) => NUMBER.test(a))) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const url = `https://api.n2yo.com/rest/v1/satellite/${endpoint}/${args.join("/")}/&apiKey=${env.N2YO_API_KEY}`;
  const upstream = await fetch(url);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": "application/json",
      // Satellites move fast, but a short cache keeps us under N2YO's hourly limits
      "cache-control": "public, max-age=15",
    },
  });
}
