'use client';

import { useEffect } from 'react';

import MyActivitiesList from './MyActivitiesList';
import { myAssignmentsLoaded } from 'features/canvass/store';
import { userAssignmentsLoaded } from 'features/callAssignments/store';
import { userEventsLoaded } from 'features/events/store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from '../types';

interface MyActivitiesListWithInitialDataProps {
  areaAssignments: ZetkinAreaAssignment[];
  callAssignments: ZetkinCallAssignment[];
  events: ZetkinEventWithStatus[];
}

/**
 * Wrapper around MyActivitiesList that pre-populates Redux store
 * with server-fetched activities data for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function MyActivitiesListWithInitialData({
  areaAssignments,
  callAssignments,
  events,
}: MyActivitiesListWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched activities data
    dispatch(myAssignmentsLoaded(areaAssignments));
    dispatch(userAssignmentsLoaded(callAssignments));
    dispatch(userEventsLoaded(events));
  }, [areaAssignments, callAssignments, events, dispatch]);

  // Render the existing MyActivitiesList which will use the hydrated store
  return <MyActivitiesList />;
}
import { FC, useEffect } from 'react';

import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from '../types';
import { useAppDispatch } from 'core/hooks';
import { myAssignmentsLoaded } from 'features/canvass/store';
import { userAssignmentsLoaded } from 'features/callAssignments/store';
import { userEventsLoaded } from 'features/events/store';
import MyActivitiesList from './MyActivitiesList';

interface Props {
  areaAssignments: ZetkinAreaAssignment[];
  callAssignments: ZetkinCallAssignment[];
  userEvents: ZetkinEventWithStatus[];
}

const MyActivitiesListWithInitialData: FC<Props> = ({
  areaAssignments,
  callAssignments,
  userEvents,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(myAssignmentsLoaded(areaAssignments));
    dispatch(userAssignmentsLoaded(callAssignments));
    dispatch(userEventsLoaded(userEvents));
  }, [areaAssignments, callAssignments, userEvents, dispatch]);

  return <MyActivitiesList />;
};

export default MyActivitiesListWithInitialData;
