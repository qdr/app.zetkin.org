'use client';

import { FC } from 'react';

import { ZetkinEvent } from 'utils/types/zetkin';
import PublicEventPageWithInitialData from 'features/organizations/components/PublicEventPageWithInitialData';

interface Props {
  event: ZetkinEvent;
  eventId: number;
  orgId: number;
}

const PublicEventPageClient: FC<Props> = ({ event, eventId, orgId }) => {
  return (
    <PublicEventPageWithInitialData
      event={event}
      eventId={eventId}
      orgId={orgId}
    />
  );
};

export default PublicEventPageClient;
