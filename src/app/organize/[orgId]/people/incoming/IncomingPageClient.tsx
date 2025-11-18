'use client';

import IncomingPageWithInitialData from 'features/joinForms/components/IncomingPageWithInitialData';
import { ZetkinJoinSubmission } from 'features/joinForms/types';

interface IncomingPageClientProps {
  orgId: number;
  submissions: ZetkinJoinSubmission[];
}

export default function IncomingPageClient({
  orgId,
  submissions,
}: IncomingPageClientProps) {
  return (
    <IncomingPageWithInitialData orgId={orgId} submissions={submissions} />
  );
}
