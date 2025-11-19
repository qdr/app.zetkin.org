'use client';

import JourneyDetailWithInitialData from 'features/journeys/components/JourneyDetailWithInitialData';
import { ZetkinJourney, ZetkinJourneyInstance } from 'utils/types/zetkin';
import { JourneyTagColumnData } from 'features/journeys/utils/journeyInstanceUtils';

interface JourneyDetailPageClientProps {
  journey: ZetkinJourney;
  journeyId: number;
  journeyInstances: ZetkinJourneyInstance[];
  orgId: number;
  tagColumnsData: JourneyTagColumnData[];
}

export default function JourneyDetailPageClient({
  journey,
  journeyId,
  journeyInstances,
  orgId,
  tagColumnsData,
}: JourneyDetailPageClientProps) {
  return (
    <JourneyDetailWithInitialData
      journey={journey}
      journeyId={journeyId}
      journeyInstances={journeyInstances}
      orgId={orgId}
      tagColumnsData={tagColumnsData}
    />
  );
}
