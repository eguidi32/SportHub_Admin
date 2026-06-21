import { NextRequest } from "next/server";

const BACKEND_API_URL = (
  process.env.BACKEND_API_URL || "https://api.sporthubsn.com"
).replace(/\/$/, "");

type ProxyContext = {
  params: Promise<{ path: string[] }>;
};

const proxyRequest = async (request: NextRequest, context: ProxyContext) => {
  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(
    `${BACKEND_API_URL}/${path.map(encodeURIComponent).join("/")}`
  );
  targetUrl.search = incomingUrl.search;

  const headers = new Headers();
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (authorization) headers.set("authorization", authorization);
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      cache: "no-store",
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    const responseContentType = response.headers.get("content-type");
    const location = response.headers.get("location");

    if (responseContentType) {
      responseHeaders.set("content-type", responseContentType);
    }
    if (location) responseHeaders.set("location", location);
    responseHeaders.set("cache-control", "no-store");

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Le backend SportHub est momentanément inaccessible.",
      },
      { status: 502 }
    );
  }
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
