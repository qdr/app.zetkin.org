'use client';

<<<<<<< HEAD
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
=======
import { FC } from 'react';

import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import PublicOrgPageWithInitialData from 'features/organizations/components/PublicOrgPageWithInitialData';

interface Props {
  organization: ZetkinOrganization;
  orgEvents: ZetkinEvent[];
  orgId: number;
  userEvents: ZetkinEventWithStatus[];
}

const PublicOrgPageClient: FC<Props> = ({
  organization,
  orgEvents,
  orgId,
  userEvents,
}) => {
  return (
    <PublicOrgPageWithInitialData
      organization={organization}
      orgEvents={orgEvents}
      orgId={orgId}
      userEvents={userEvents}
    />
  );
};

export default PublicOrgPageClient;
>>>>>>> 44bc9c466da9b5e96bcb7cabdc3ad91c664aac94
