'use client';

import ClosedJourneysWithInitialData from 'features/journeys/components/ClosedJourneysWithInitialData';
import { ZetkinJourney, ZetkinJourneyInstance } from 'utils/types/zetkin';
import { JourneyTagColumnData } from 'features/journeys/utils/journeyInstanceUtils';

interface ClosedJourneysPageClientProps {
  journey: ZetkinJourney;
  journeyId: number;
  journeyInstances: ZetkinJourneyInstance[];
  orgId: number;
  tagColumnsData: JourneyTagColumnData[];
}

export default function ClosedJourneysPageClient({
  journey,
  journeyId,
  journeyInstances,
  orgId,
  tagColumnsData,
}: ClosedJourneysPageClientProps) {
  return (
    <ClosedJourneysWithInitialData
      journey={journey}
      journeyId={journeyId}
      journeyInstances={journeyInstances}
      orgId={orgId}
      tagColumnsData={tagColumnsData}
    />
  );
}
