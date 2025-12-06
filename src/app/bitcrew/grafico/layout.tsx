"use client";

import { Suspense } from "react";

export default function GraficoLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  );
}
