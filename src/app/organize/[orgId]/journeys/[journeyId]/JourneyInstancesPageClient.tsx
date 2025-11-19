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

interface JourneyInstancesPageClientProps {
  orgId: number;
  journeyId: number;
}

const JourneyInstancesPageClient: FC<JourneyInstancesPageClientProps> = ({
  orgId,
  journeyId,
}: JourneyInstancesPageClientProps) => {
  const journeyFuture = useJourney(orgId, journeyId);
  const journeyInstancesFuture = useJourneyInstances(orgId, journeyId);

  return (
    <AllJourneyInstancesLayout fixedHeight>
      <ZUIFuture future={journeyInstancesFuture}>
        {(data: JourneyInstancesData) => {
          const openJourneyInstances = data.journeyInstances.filter(
            (journeyInstance: ZetkinJourneyInstance) =>
              journeyInstance.closed == null
          );

          return (
            <JourneyInstancesDataTable
              journeyInstances={openJourneyInstances}
              storageKey={`journeyInstances-${journeyFuture.data?.id}-open`}
              tagColumnsData={data.tagColumnsData}
            />
          );
        }}
      </ZUIFuture>
      <JourneyInstanceCreateFab />
    </AllJourneyInstancesLayout>
  );
};

export default JourneyInstancesPageClient;
