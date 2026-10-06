import { type NextRequest } from "next/server";

const UPSTREAM = "https://povsync.netlify.app";
const PREFIX = "/live-previews/povsync";

function rewriteRootPaths(html: string) {
  return html
    .replaceAll('href="/', `href="${PREFIX}/`)
    .replaceAll("href='/", `href='${PREFIX}/`)
    .replaceAll('src="/', `src="${PREFIX}/`)
    .replaceAll("src='/", `src='${PREFIX}/`);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await context.params;
  const suffix = path.length ? `/${path.join("/")}` : "/";
  const upstream = `${UPSTREAM}${suffix}${request.nextUrl.search}`;
  const res = await fetch(upstream, { redirect: "follow" });
  const type = res.headers.get("content-type") ?? "";

  const headers = new Headers();
  headers.set("X-Frame-Options", "SAMEORIGIN");
  if (type) headers.set("Content-Type", type);

  if (type.includes("text/html")) {
    return new Response(rewriteRootPaths(await res.text()), {
      status: res.status,
      headers,
    });
  }

  return new Response(res.body, { status: res.status, headers });
}
