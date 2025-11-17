'use client';

import JourneyInstanceCreateFab from 'features/journeys/components/JourneyInstanceCreateFab';
import JourneyInstancesDataTable from 'features/journeys/components/JourneyInstancesDataTable';
import useJourney from 'features/journeys/hooks/useJourney';
import useJourneyInstances from 'features/journeys/hooks/useJourneyInstances';
import { useNumericRouteParams } from 'core/hooks';
import ZUIFuture from 'zui/ZUIFuture';

const OpenJourneyInstancesPage = () => {
  const { orgId, journeyId } = useNumericRouteParams();
  const journeyFuture = useJourney(orgId, journeyId);
  const journeyInstancesFuture = useJourneyInstances(orgId, journeyId);

  return (
    <>
            <ZUIFuture future={journeyInstancesFuture}>
        {(data) => {
          const openJourneyInstances = data.journeyInstances.filter(
            (journeyInstance) => journeyInstance.closed == null
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
    </>
  );
};

export default OpenJourneyInstancesPage;
