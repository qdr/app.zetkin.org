'use client';

import { FC, useLayoutEffect, useState } from 'react';

import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from '../types';
import { useAppDispatch } from 'core/hooks';
import { allEventsLoaded, userEventsLoaded } from 'features/events/store';
import sortEventsByStartTime from 'features/events/utils/sortEventsByStartTime';
import AllEventsList from './AllEventsList';

interface Props {
  allEvents: ZetkinEvent[];
  userEvents: ZetkinEventWithStatus[];
}

const AllEventsListWithInitialData: FC<Props> = ({
  allEvents,
  userEvents,
}) => {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const sorted = [...allEvents].sort(sortEventsByStartTime);
    dispatch(allEventsLoaded(sorted));
    dispatch(userEventsLoaded(userEvents));
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <div style={{ display: 'none' }} />;
  }

  return <AllEventsList />;
};

export default AllEventsListWithInitialData;
