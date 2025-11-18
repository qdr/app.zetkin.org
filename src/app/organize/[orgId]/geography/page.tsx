import { Suspense } from 'react';

import { getServerApiClient } from 'core/api/server';
import GeographyPageClient from './GeographyPageClient';
import GLGeographyMapSkeleton from 'features/geography/components/GLGeographyMapSkeleton';
import { Zetkin2Area } from 'features/areas/types';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';

type PageProps = {
  params: {
    orgId: string;
  };
};

// Server Component - pre-fetches areas data for faster initial render
export default async function GeographyPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const apiClient = await getServerApiClient();

  // Pre-fetch all areas (paginated)
  const areas = await fetchAllPaginated<Zetkin2Area>((page) =>
    apiClient.get(`/api2/orgs/${orgId}/areas?size=100&page=${page}`)
  );

  return (
    <Suspense fallback={<GLGeographyMapSkeleton />}>
      <GeographyPageClient areas={areas} orgId={orgId} />
    </Suspense>
  );
}
