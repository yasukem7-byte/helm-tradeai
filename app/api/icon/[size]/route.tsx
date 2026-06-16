import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params;
  const s = size === "512" ? 512 : 192;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${s}" height="${s}">
  <rect width="512" height="512" rx="77" fill="#131722"/>
  <polyline points="60,380 160,260 230,300 320,160 450,200" fill="none" stroke="#26a69a" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="256" y="470" font-family="Arial Black,sans-serif" font-size="80" font-weight="900" fill="#3b82f6" text-anchor="middle">HELM</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
