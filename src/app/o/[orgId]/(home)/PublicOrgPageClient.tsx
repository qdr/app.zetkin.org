'use client';

import PublicOrgPageWithInitialData from 'features/organizations/components/PublicOrgPageWithInitialData';
import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

interface PublicOrgPageClientProps {
  myEvents: ZetkinEventWithStatus[];
  orgEvents: ZetkinEvent[];
  orgId: number;
  organization: ZetkinOrganization;
}

export default function PublicOrgPageClient({
  myEvents,
  orgEvents,
  orgId,
  organization,
}: PublicOrgPageClientProps) {
  return (
    <PublicOrgPageWithInitialData
      myEvents={myEvents}
      orgEvents={orgEvents}
      orgId={orgId}
      organization={organization}
    />
  );
}
