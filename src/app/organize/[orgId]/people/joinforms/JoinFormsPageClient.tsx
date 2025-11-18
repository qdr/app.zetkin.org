'use client';

import JoinFormsWithInitialData from 'features/joinForms/components/JoinFormsWithInitialData';
import { ZetkinJoinForm } from 'features/joinForms/types';

interface JoinFormsPageClientProps {
  joinForms: ZetkinJoinForm[];
  orgId: number;
}

export default function JoinFormsPageClient({
  joinForms,
  orgId,
}: JoinFormsPageClientProps) {
  return <JoinFormsWithInitialData joinForms={joinForms} orgId={orgId} />;
}
