'use client';

import { useEffect } from 'react';

import JourneyInstanceCreateFab from './JourneyInstanceCreateFab';
import JourneyInstancesDataTable from './JourneyInstancesDataTable';
import { journeyLoaded, journeyInstancesLoaded } from '../store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinJourney, ZetkinJourneyInstance } from 'utils/types/zetkin';
import { JourneyTagColumnData } from '../utils/journeyInstanceUtils';

interface ClosedJourneysWithInitialDataProps {
  journey: ZetkinJourney;
  journeyId: number;
  journeyInstances: ZetkinJourneyInstance[];
  orgId: number;
  tagColumnsData: JourneyTagColumnData[];
}

export default function ClosedJourneysWithInitialData({
  journey,
  journeyId,
  journeyInstances,
  orgId,
  tagColumnsData,
}: ClosedJourneysWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(journeyLoaded(journey));
    dispatch(journeyInstancesLoaded([journeyId, journeyInstances]));
  }, [journey, journeyId, journeyInstances, dispatch]);

  const closedJourneyInstances = journeyInstances.filter(
    (journeyInstance) => Boolean(journeyInstance.closed)
  );

  return (
    <>
      <JourneyInstancesDataTable
        journeyInstances={closedJourneyInstances}
        storageKey={`journeyInstances-${journey.id}-closed`}
        tagColumnsData={tagColumnsData}
      />
      <JourneyInstanceCreateFab />
    </>
  );
}
