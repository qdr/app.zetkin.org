'use client';

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
