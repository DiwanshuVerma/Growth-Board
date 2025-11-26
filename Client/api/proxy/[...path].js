export default async function handler(req, res) {
  const BACKEND_BASE = process.env.BACKEND_BASE_URL;

  if (!BACKEND_BASE) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "BACKEND_BASE_URL not set" }));
    return;
  }

  const { path = [] } = req.query;
  const joinedPath = Array.isArray(path) ? "/" + path.join("/") : "";
  const search = req.url.includes("?")
    ? req.url.slice(req.url.indexOf("?"))
    : "";
  const targetUrl = BACKEND_BASE + joinedPath + search;

  try {
    const init = {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
      },
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      let body = req.body;
      if (body && typeof body === "object") {
        body = JSON.stringify(body);
        init.headers["content-type"] = "application/json";
      }
      init.body = body;
    }

    const backendRes = await fetch(targetUrl, init);
    const text = await backendRes.text();

    res.statusCode = backendRes.status;
    const ct = backendRes.headers.get("content-type");
    if (ct) res.setHeader("content-type", ct);

    res.end(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "Proxy error", details: String(err) }));
  }
}
