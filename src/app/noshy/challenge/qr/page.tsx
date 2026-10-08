"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

/** One big QR on screen. Each scan opens /noshy/challenge and generates a new random card. */
export default function ChallengeQrPage() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || window.location.origin;
    setUrl(`${site}/noshy/challenge?src=qr`);
  }, []);

  return (
    <main className="noshy-challenge noshy-qr-only">
      {url && (
        <div className="noshy-qr-big">
          <QRCodeSVG value={url} size={512} level="M" bgColor="#ffffff" fgColor="#000000" marginSize={2} />
        </div>
      )}
      <p className="noshy-qr-caption">Scan for your <em>icebreaker.</em></p>
    </main>
  );
}
