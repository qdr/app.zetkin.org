'use client';

<<<<<<< HEAD
import PublicEventPageWithInitialData from 'features/organizations/components/PublicEventPageWithInitialData';
import { ZetkinEvent, ZetkinMembership } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

interface PublicEventPageClientProps {
  event: ZetkinEvent;
  eventId: number;
  memberships: ZetkinMembership[];
  myEvents: ZetkinEventWithStatus[];
  orgId: number;
}

export default function PublicEventPageClient({
  event,
  eventId,
  memberships,
  myEvents,
  orgId,
}: PublicEventPageClientProps) {
=======
import { FC } from 'react';

import { ZetkinEvent } from 'utils/types/zetkin';
import PublicEventPageWithInitialData from 'features/organizations/components/PublicEventPageWithInitialData';

interface Props {
  event: ZetkinEvent;
  eventId: number;
  orgId: number;
}

const PublicEventPageClient: FC<Props> = ({ event, eventId, orgId }) => {
>>>>>>> 44bc9c466da9b5e96bcb7cabdc3ad91c664aac94
  return (
    <PublicEventPageWithInitialData
      event={event}
      eventId={eventId}
<<<<<<< HEAD
      memberships={memberships}
      myEvents={myEvents}
      orgId={orgId}
    />
  );
}
=======
      orgId={orgId}
    />
  );
};

export default PublicEventPageClient;
>>>>>>> 44bc9c466da9b5e96bcb7cabdc3ad91c664aac94
