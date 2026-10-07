import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#101010",
          color: "#f5f4f0",
          padding: "96px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: "120px", lineHeight: 1 }}>✲</div>
        <div style={{ fontSize: "72px", fontWeight: 600, marginTop: "24px", letterSpacing: "-0.02em" }}>
          harv components
        </div>
        <div style={{ fontSize: "32px", marginTop: "16px", opacity: 0.6 }}>
          Every entry earned its place.
        </div>
      </div>
    ),
    { ...size },
  );
}
