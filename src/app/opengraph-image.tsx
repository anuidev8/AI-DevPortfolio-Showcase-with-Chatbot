import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Angel Mateus — AI voice agents, software, mentorship and events";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const services = ["AI voice agents", "Enterprise software", "AI Engineer mentorship", "Tech events"];

// Default social card for every page that doesn't define its own.
export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public/angel-arrieta.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0B1020",
          color: "#EEF1F7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc} alt="" width={96} height={96} style={{ borderRadius: 48, objectFit: "cover" }} />
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>
            angel<span style={{ color: "#5B8CFF" }}>.</span>mateus
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            I build AI products people actually talk to.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {services.map((s) => (
              <div
                key={s}
                style={{ display: "flex", fontSize: 26, padding: "10px 20px", borderRadius: 999, border: "2px solid #2F3B5C", color: "#C5CCDB" }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#A3ADC2" }}>
          <span>Medellín → LatAm &amp; US</span>
          <span style={{ color: "#5B8CFF" }}>www.angelmateus.com</span>
        </div>
      </div>
    ),
    size,
  );
}
