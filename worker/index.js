// Cloudflare Worker: serves the React build and proxies /n2yo/* to N2YO.
// The API key is a Worker secret (N2YO_API_KEY) and never reaches the browser.
// Only the two endpoints the app uses, with numeric params, are forwarded.
const ALLOWED = new Set(["above", "positions"]);
const NUMBER = /^-?\d+(\.\d+)?$/;

async function proxyN2yo(pathname, env) {
  const [endpoint, ...args] = pathname.replace(/^\/n2yo\//, "").split("/").filter(Boolean);
  if (!ALLOWED.has(endpoint) || args.length === 0 || !args.every((a) => NUMBER.test(a))) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  const url = `https://api.n2yo.com/rest/v1/satellite/${endpoint}/${args.join("/")}/&apiKey=${env.N2YO_API_KEY}`;
  const upstream = await fetch(url);
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "content-type": "application/json", "cache-control": "public, max-age=15" },
  });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/n2yo/")) return proxyN2yo(pathname, env);
    return env.ASSETS.fetch(request);
  },
};
