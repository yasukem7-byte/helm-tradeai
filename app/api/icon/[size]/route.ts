import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params;
  const s = size === "512" ? 512 : 192;

  return new ImageResponse(
    (
      <div
        style={{
          width: s,
          height: s,
          background: "#131722",
          borderRadius: s * 0.15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* chart line */}
        <svg
          width={s * 0.7}
          height={s * 0.45}
          viewBox="0 0 280 160"
          style={{ marginBottom: s * 0.04 }}
        >
          <polyline
            points="10,140 70,90 110,110 170,40 270,70"
            fill="none"
            stroke="#26a69a"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            fontSize: s * 0.18,
            fontWeight: 900,
            color: "#3b82f6",
            letterSpacing: "-1px",
            fontFamily: "Arial Black, sans-serif",
          }}
        >
          HELM
        </div>
      </div>
    ),
    { width: s, height: s }
  );
}
