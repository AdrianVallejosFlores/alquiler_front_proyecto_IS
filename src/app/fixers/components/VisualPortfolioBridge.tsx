'use client';

import { useClientSession } from "@/lib/auth/useSession";
import VisualPortfolioSection from "@/app/about_fixer/components/VisualPortfolioSection";

type Props = {
  fixerId: string;
};

export default function VisualPortfolioBridge({ fixerId }: Props) {
  const { user } = useClientSession();
  const isOwner = user?.fixerId === fixerId;

  return <VisualPortfolioSection fixerId={fixerId} isOwner={isOwner} />;
}
