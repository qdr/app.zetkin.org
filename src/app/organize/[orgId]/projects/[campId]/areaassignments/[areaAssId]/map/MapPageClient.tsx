'use client';

import 'leaflet/dist/leaflet.css';
import { FC } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

import AreaAssignmentLayout from 'features/areaAssignments/layouts/AreaAssignmentLayout';
import useAreas from 'features/areas/hooks/useAreas';
import useAreaAssignees from 'features/areaAssignments/hooks/useAreaAssignees';
import useAssignmentAreaStats from 'features/areaAssignments/hooks/useAssignmentAreaStats';
import ZUIFutures from 'zui/ZUIFutures';
import AreaFilterProvider from 'features/areas/components/AreaFilters/AreaFilterContext';
import AssigneeFilterProvider from 'features/areaAssignments/components/OrganizerMapFilters/AssigneeFilterContext';
import useAreaAssignmentMutations from 'features/areaAssignments/hooks/useAreaAssignmentMutations';
import { ZetkinLocation } from 'features/areaAssignments/types';

const OrganizerMap = dynamic(
  () =>
    import(
      'features/areaAssignments/components/OrganizerMap'
    ),
  { ssr: false }
);

interface MapPageClientProps {
  orgId: string;
  areaAssId: number;
  campId: string;
}

const MapPageClient: FC<MapPageClientProps> = ({
  areaAssId,
  orgId,
  campId,
}) => {
  const areas = useAreas(parseInt(orgId)).data || [];
  // TODO: Re-enable this
  //const locations = useLocations(parseInt(orgId), areaAssId).data || [];
  const locations: ZetkinLocation[] = [];
  const areaStatsFuture = useAssignmentAreaStats(parseInt(orgId), areaAssId);
  const sessionsFuture = useAreaAssignees(parseInt(orgId), areaAssId);
  const { assignArea: assignUserToArea } = useAreaAssignmentMutations(
    parseInt(orgId),
    areaAssId
  );

  return (
    <AreaAssignmentLayout areaAssId={areaAssId} campId={campId} orgId={orgId}>
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
    </AreaAssignmentLayout>
  );
};

export default MapPageClient;
