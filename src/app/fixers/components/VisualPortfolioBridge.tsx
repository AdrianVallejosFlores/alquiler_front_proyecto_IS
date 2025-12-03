'use client';

import { useEffect, useState } from "react";
import { useClientSession } from "@/lib/auth/useSession";
import VisualPortfolioSection from "@/app/about_fixer/components/VisualPortfolioSection";

type Props = {
  fixerId: string;
};

export default function VisualPortfolioBridge({ fixerId }: Props) {
  const { user } = useClientSession();
  const isOwner = user?.fixerId === fixerId;

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      if (typeof detail?.open === "boolean") {
        setEditMode(detail.open);
      }
    };
    window.addEventListener("fixer-edit-mode", handler as EventListener);
    return () => window.removeEventListener("fixer-edit-mode", handler as EventListener);
  }, []);

  return <VisualPortfolioSection fixerId={fixerId} isOwner={isOwner} showForms={Boolean(editMode && isOwner)} />;
}
