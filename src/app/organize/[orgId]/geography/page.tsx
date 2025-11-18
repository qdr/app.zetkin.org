'use client';

import { Suspense } from 'react';

import GLGeographyMap from 'features/geography/components/GLGeographyMap';
import GLGeographyMapSkeleton from 'features/geography/components/GLGeographyMapSkeleton';
import useAreas from 'features/areas/hooks/useAreas';
import { useNumericRouteParams } from 'core/hooks';

function GeographyMapContent({ orgId }: { orgId: number }) {
  const areasFuture = useAreas(orgId);

  if (!areasFuture.data) {
    return <GLGeographyMapSkeleton />;
  }

  return <GLGeographyMap areas={areasFuture.data} orgId={orgId} />;
}

const GeographyPage = () => {
  const { orgId } = useNumericRouteParams();

  return (
    <Suspense fallback={<GLGeographyMapSkeleton />}>
      <GeographyMapContent orgId={orgId} />
    </Suspense>
  );
};

export default GeographyPage;
