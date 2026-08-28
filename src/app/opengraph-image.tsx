import { ImageResponse } from "next/og";

export const alt = "The Roman Estate — Luxury Real Estate in Mumbai";
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
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #1e1b4b 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.25)",
            filter: "blur(10px)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 6,
              height: 64,
              background: "#C2A365",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 22,
                letterSpacing: 12,
                color: "#94a3b8",
                fontWeight: 600,
              }}
            >
              THE
            </span>
            <span
              style={{
                fontSize: 76,
                fontWeight: 700,
                color: "white",
                letterSpacing: 2,
                lineHeight: 1,
              }}
            >
              ROMAN ESTATE
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#94a3b8",
            fontWeight: 500,
            letterSpacing: 1,
          }}
        >
          Luxury Real Estate in Mumbai
        </div>
      </div>
    ),
    { ...size },
  );
}
