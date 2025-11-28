'use client';

import { useClientSession } from "@/lib/auth/useSession";
import WorkExperienceSection from "@/app/about_fixer/components/WorkExperienceSection";

type Props = {
  fixerId: string;
};

export default function WorkExperienceBridge({ fixerId }: Props) {
  const { user } = useClientSession();
  const isOwner = user?.fixerId === fixerId;

  return <WorkExperienceSection fixerId={fixerId} isOwner={isOwner} />;
}
