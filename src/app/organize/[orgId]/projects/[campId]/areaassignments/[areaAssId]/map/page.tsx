'use client';

import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

import useAreas from 'features/areas/hooks/useAreas';
import useServerSide from 'core/useServerSide';
import useAreaAssignees from 'features/areaAssignments/hooks/useAreaAssignees';
import useAssignmentAreaStats from 'features/areaAssignments/hooks/useAssignmentAreaStats';
import ZUIFutures from 'zui/ZUIFutures';
import AreaFilterProvider from 'features/areas/components/AreaFilters/AreaFilterContext';
import AssigneeFilterProvider from 'features/areaAssignments/components/OrganizerMapFilters/AssigneeFilterContext';
import useAreaAssignmentMutations from 'features/areaAssignments/hooks/useAreaAssignmentMutations';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinLocation } from 'features/areaAssignments/types';

const OrganizerMap = dynamic(
  () =>
    import(
      '../../../../../../../features/areaAssignments/components/OrganizerMap'
    ),
  { ssr: false }
);

const OrganizerMapPage = () => {
  const { orgId, areaAssId } = useNumericRouteParams();
  const areas = useAreas(orgId).data || [];
  // TODO: Re-enable this
  //const locations = useLocations(orgId, areaAssId).data || [];
  const locations: ZetkinLocation[] = [];
  const areaStatsFuture = useAssignmentAreaStats(orgId, areaAssId);
  const sessionsFuture = useAreaAssignees(orgId, areaAssId);
  const { assignArea: assignUserToArea } = useAreaAssignmentMutations(
    orgId,
    areaAssId
  );

  const isServer = useServerSide();
  if (isServer) {
    return null;
  }

  return (
    <>
            <Box height="100%">
        <ZUIFutures
          futures={{
            areaStats: areaStatsFuture,
            sessions: sessionsFuture,
          }}
        >
          {({ data: { areaStats, sessions } }) => (
            <AreaFilterProvider>
              <AssigneeFilterProvider>
                <OrganizerMap
                  areaAssId={areaAssId}
                  areas={areas.map((area) => ({
                    description: area.description,
                    id: area.id,
                    organization_id: area.organization_id,
                    points: area.boundary.coordinates[0],
                    tags: [],
                    title: area.title,
                  }))}
                  areaStats={areaStats}
                  locations={locations}
                  onAddAssigneeToArea={(area, user) => {
                    assignUserToArea(user.id, area.id);
                  }}
                  sessions={sessions}
                />
              </AssigneeFilterProvider>
            </AreaFilterProvider>
          )}
        </ZUIFutures>
      </Box>
    </>
  );
};

export default OrganizerMapPage;
