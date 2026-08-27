"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";

const cardEase = [0.22, 1, 0.36, 1] as const;

export default function NoshyPage() {
  return (
    <main className="noshy-page">
      <div className="noshy-shell">
        <header className="noshy-topbar">
          <div className="noshy-brand">
            <span className="noshy-brand-mark">VB</span>
            <span>Visible Builders</span>
          </div>
          <span className="noshy-top-label">NoShy</span>
        </header>

        <div className="noshy-stage">
          <motion.section
            className="noshy-panel noshy-coming-soon"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: cardEase }}
          >
            <div className="noshy-coming-icon" aria-hidden="true">
              <Clock size={28} />
            </div>

            <p className="noshy-eyebrow">Not available yet</p>
            <h1>NoShy is almost ready.</h1>
            <p>
              The networking experience is still in private prep. We&apos;re finishing match quality,
              check-in flow, and the live room desk before opening it.
            </p>

            <ul className="noshy-coming-list">
              <li>
                <Sparkles size={15} />
                <span>Public release is coming soon for Visible Builders events.</span>
              </li>
              <li>
                <Clock size={15} />
                <span>Access will unlock when the next networking night goes live.</span>
              </li>
            </ul>

            <p className="noshy-coming-note">
              If you scanned a QR at an event, hang tight — the host will announce when NoShy opens.
            </p>

            <Link href="/" className="noshy-btn noshy-btn-secondary noshy-btn-full">
              <ArrowLeft size={16} />
              Back to portfolio
            </Link>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
