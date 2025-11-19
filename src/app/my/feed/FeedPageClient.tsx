'use client';

import { FC } from 'react';

import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import AllEventsListWithInitialData from 'features/home/components/AllEventsListWithInitialData';

interface Props {
  allEvents: ZetkinEvent[];
  userEvents: ZetkinEventWithStatus[];
}

const FeedPageClient: FC<Props> = ({ allEvents, userEvents }) => {
  return (
    <AllEventsListWithInitialData
      allEvents={allEvents}
      userEvents={userEvents}
    />
  );
};

export default FeedPageClient;
