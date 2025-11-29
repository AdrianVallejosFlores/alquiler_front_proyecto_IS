import { Suspense } from "react";
import CrearOfertaPageClient from "./CrearOfertaPage.client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <CrearOfertaPageClient />
    </Suspense>
  );
}
