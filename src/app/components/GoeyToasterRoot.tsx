"use client";

import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";

/**
 * Renders the goey-toast container so toasts work app-wide (main + dashboard).
 * Must be mounted once in the root layout.
 */
export default function GoeyToasterRoot() {
  return <GooeyToaster position="bottom-right" />;
}
