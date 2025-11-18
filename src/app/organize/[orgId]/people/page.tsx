import { getServerApiClient } from 'core/api/server';
import { ViewTreeData } from 'pages/api/views/tree';
import PeoplePageClient from './PeoplePageClient';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';

import messageIds from 'features/views/l10n/messageIds';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import ViewBrowser from 'features/views/components/ViewBrowser';
import ViewBrowserSkeleton from 'features/views/components/ViewBrowserSkeleton';
interface PageProps {
  params: {
    orgId: string;
  };
}

// Server Component - pre-fetches view tree data for faster initial render
export default async function PeopleViewsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);

  return <ViewBrowser basePath={`/organize/${orgId}/people`} />;
  return (
    <PeopleLayout>
      <Suspense fallback={<ViewBrowserSkeleton />}>
        <ViewBrowser basePath={`/organize/${orgId}/people`} />
      </Suspense>
    </PeopleLayout>
  // Pre-fetch view tree data on server
  const apiClient = await getServerApiClient();
  const viewTree = await apiClient.get<ViewTreeData>(
    `/api/views/tree?orgId=${orgId}`
  );

  return <PeoplePageClient orgId={orgId} viewTree={viewTree} />;
}
