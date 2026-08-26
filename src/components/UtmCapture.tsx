"use client";

import { useEffect } from "react";
import { captureUtmFromUrl } from "@/lib/utm";

export default function UtmCapture() {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);
  return null;
}
