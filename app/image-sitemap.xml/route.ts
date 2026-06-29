import { getSiteUrl } from "@/lib/site";
import { SITE_SITEMAP_IMAGES } from "@/lib/siteBusiness";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const siteUrl = getSiteUrl();

  const pages = SITE_SITEMAP_IMAGES.reduce<
    Map<string, Array<(typeof SITE_SITEMAP_IMAGES)[number]>>
  >((map, image) => {
  const pageUrl = image.pagePath === "/" ? `${siteUrl}/` : `${siteUrl}${image.pagePath}`;
    const bucket = map.get(pageUrl) ?? [];
    bucket.push(image);
    map.set(pageUrl, bucket);
    return map;
  }, new Map());

  const urlEntries = [...pages.entries()]
    .map(([pageUrl, images]) => {
      const imageEntries = images
        .map(
          (image) => `    <image:image>
      <image:loc>${escapeXml(`${siteUrl}${image.loc}`)}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
      <image:caption>${escapeXml(image.caption)}</image:caption>
    </image:image>`,
        )
        .join("\n");

      return `  <url>
    <loc>${escapeXml(pageUrl)}</loc>
${imageEntries}
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
