'use client';

import { FC } from 'react';

import AllJourneyInstancesLayout from 'features/journeys/layout/AllJourneyInstancesLayout';
import JourneyInstanceCreateFab from 'features/journeys/components/JourneyInstanceCreateFab';
import JourneyInstancesDataTable from 'features/journeys/components/JourneyInstancesDataTable';
import { JourneyInstancesData } from 'features/journeys/hooks/useJourneyInstances';
import useJourney from 'features/journeys/hooks/useJourney';
import useJourneyInstances from 'features/journeys/hooks/useJourneyInstances';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';

interface ClosedInstancesPageClientProps {
  orgId: number;
  journeyId: number;
}

const ClosedInstancesPageClient: FC<ClosedInstancesPageClientProps> = ({
  orgId,
  journeyId,
}: ClosedInstancesPageClientProps) => {
  const journeyFuture = useJourney(orgId, journeyId);
  const journeyInstancesFuture = useJourneyInstances(orgId, journeyId);

  return (
    <AllJourneyInstancesLayout fixedHeight>
      <ZUIFuture future={journeyInstancesFuture}>
        {(data: JourneyInstancesData) => {
          const closedJourneyInstances = data.journeyInstances.filter(
            (journeyInstance: ZetkinJourneyInstance) =>
              Boolean(journeyInstance.closed)
          );

          return (
            <JourneyInstancesDataTable
              journeyInstances={closedJourneyInstances}
              storageKey={`journeyInstances-${journeyFuture.data?.id}-closed`}
              tagColumnsData={data.tagColumnsData}
            />
          );
        }}
      </ZUIFuture>
      <JourneyInstanceCreateFab />
    </AllJourneyInstancesLayout>
  );
};

export default ClosedInstancesPageClient;
