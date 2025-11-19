'use client';

import { useEffect } from 'react';

import JourneyInstanceCreateFab from './JourneyInstanceCreateFab';
import JourneyInstancesDataTable from './JourneyInstancesDataTable';
import { journeyLoaded, journeyInstancesLoaded } from '../store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinJourney, ZetkinJourneyInstance } from 'utils/types/zetkin';
import { JourneyTagColumnData } from '../utils/journeyInstanceUtils';

interface JourneyDetailWithInitialDataProps {
  journey: ZetkinJourney;
  journeyId: number;
  journeyInstances: ZetkinJourneyInstance[];
  orgId: number;
  tagColumnsData: JourneyTagColumnData[];
}

export default function JourneyDetailWithInitialData({
  journey,
  journeyId,
  journeyInstances,
  orgId,
  tagColumnsData,
}: JourneyDetailWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(journeyLoaded(journey));
    dispatch(journeyInstancesLoaded([journeyId, journeyInstances]));
  }, [journey, journeyId, journeyInstances, dispatch]);

  const openJourneyInstances = journeyInstances.filter(
    (journeyInstance) => journeyInstance.closed == null
  );

  return (
    <>
      <JourneyInstancesDataTable
        journeyInstances={openJourneyInstances}
        storageKey={`journeyInstances-${journey.id}-open`}
        tagColumnsData={tagColumnsData}
      />
      <JourneyInstanceCreateFab />
    </>
  );
}
