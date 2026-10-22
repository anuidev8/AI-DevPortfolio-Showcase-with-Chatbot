"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { CameraOff } from "lucide-react";
import { parseNoshyCode, type NoshyCode } from "@/lib/noshy-game";

type CardScannerProps = {
  onCode: (code: NoshyCode) => void;
  className?: string;
};

const SCAN_INTERVAL_MS = 180;
const SCAN_SIZE = 480;

/** Rear-camera QR reader for NoShy attendee and mission cards. Non-NoShy codes are ignored. */
export function CardScanner({ onCode, className }: CardScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const onCodeRef = useRef(onCode);
  const [error, setError] = useState("");
  const [foreign, setForeign] = useState(false);

  useEffect(() => {
    onCodeRef.current = onCode;
  }, [onCode]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: number | null = null;
    let done = false;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    const scan = () => {
      const video = videoRef.current;
      if (done || !video || !context || video.readyState < 2 || !video.videoWidth) return;
      // Center square, downscaled: fast enough for jsQR on a phone.
      const side = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = SCAN_SIZE;
      canvas.height = SCAN_SIZE;
      context.drawImage(
        video,
        (video.videoWidth - side) / 2, (video.videoHeight - side) / 2, side, side,
        0, 0, SCAN_SIZE, SCAN_SIZE
      );
      const image = context.getImageData(0, 0, SCAN_SIZE, SCAN_SIZE);
      const result = jsQR(image.data, SCAN_SIZE, SCAN_SIZE, { inversionAttempts: "attemptBoth" });
      if (!result?.data) return;
      const code = parseNoshyCode(result.data);
      if (!code) {
        setForeign(true);
        return;
      }
      done = true;
      onCodeRef.current(code);
    };

    void (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("no camera api");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (done) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play().catch(() => undefined);
        timer = window.setInterval(scan, SCAN_INTERVAL_MS);
      } catch {
        setError("Camera is blocked. Allow camera access, or scan the card with your phone's camera app.");
      }
    })();

    return () => {
      done = true;
      if (timer != null) window.clearInterval(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className={`noshy-scanner ${className ?? ""}`}>
      {error ? (
        <div className="noshy-scanner-error"><CameraOff size={26} /><p>{error}</p></div>
      ) : (
        <>
          <video ref={videoRef} muted playsInline aria-label="Camera preview" />
          <span className="noshy-scanner-frame" aria-hidden="true" />
          <p className="noshy-scanner-hint" role="status">
            {foreign ? "That's not a NoShy QR. Try another one." : "Align their profile QR in the frame"}
          </p>
        </>
      )}
    </div>
  );
}
