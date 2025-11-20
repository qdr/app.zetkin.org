'use client';

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
