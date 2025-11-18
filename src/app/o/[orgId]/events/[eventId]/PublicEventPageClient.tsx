'use client';

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
  return (
    <PublicEventPageWithInitialData
      event={event}
      eventId={eventId}
      memberships={memberships}
      myEvents={myEvents}
      orgId={orgId}
    />
  );
}
