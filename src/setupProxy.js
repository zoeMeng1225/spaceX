// Local dev proxy (picked up automatically by Create React App).
// Reads N2YO_API_KEY from .env.local and signs requests server-side.
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const apiKey = process.env.N2YO_API_KEY;
  if (!apiKey) {
    console.warn("\n  N2YO_API_KEY is missing. Copy .env.example to .env.local and add your key.\n");
  }

  app.use(
    "/n2yo",
    createProxyMiddleware({
      target: "https://api.n2yo.com",
      changeOrigin: true,
      pathRewrite: (path) =>
        `/rest/v1/satellite${path.replace(/^\/n2yo/, "")}&apiKey=${apiKey}`,
    })
  );
};
