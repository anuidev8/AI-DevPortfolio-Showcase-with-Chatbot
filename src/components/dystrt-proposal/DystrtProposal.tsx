"use client";

import { useEffect, useRef } from "react";
import { markup } from "./markup";
import { initProposal } from "./init";
import "./dystrt-proposal.css";

/**
 * DY//STRT × No Signal Club launch proposal.
 * Built from the approved preview at design/dystrt/preview.html — that file is the spec.
 */
export default function DystrtProposal({ fontClassName = "" }: { fontClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return initProposal(ref.current);
  }, []);

  return <div ref={ref} className={`dystrt ${fontClassName}`} dangerouslySetInnerHTML={{ __html: markup }} />;
}
