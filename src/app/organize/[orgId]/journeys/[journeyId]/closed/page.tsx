'use client';

import JourneyInstanceCreateFab from 'features/journeys/components/JourneyInstanceCreateFab';
import JourneyInstancesDataTable from 'features/journeys/components/JourneyInstancesDataTable';
import useJourney from 'features/journeys/hooks/useJourney';
import useJourneyInstances from 'features/journeys/hooks/useJourneyInstances';
import { useNumericRouteParams } from 'core/hooks';
import ZUIFuture from 'zui/ZUIFuture';

const ClosedJourneyInstancesPage = () => {
  const { orgId, journeyId } = useNumericRouteParams();
  const journeyFuture = useJourney(orgId, journeyId);
  const journeyInstancesFuture = useJourneyInstances(orgId, journeyId);

  return (
    <>
            <ZUIFuture future={journeyInstancesFuture}>
        {(data) => {
          const openJourneyInstances = data.journeyInstances.filter(
            (journeyInstance) => Boolean(journeyInstance.closed)
          );

          return (
            <JourneyInstancesDataTable
              journeyInstances={openJourneyInstances}
              storageKey={`journeyInstances-${journeyFuture.data?.id}-closed`}
              tagColumnsData={data.tagColumnsData}
            />
          );
        }}
      </ZUIFuture>
      <JourneyInstanceCreateFab />
    </>
  );
};

export default ClosedJourneyInstancesPage;
