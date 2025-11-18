'use client';

import { Suspense } from 'react';

import PeopleLayout from 'features/views/layout/PeopleLayout';
import ViewBrowserSkeleton from 'features/views/components/ViewBrowserSkeleton';
import ViewBrowserWithInitialData from 'features/views/components/ViewBrowserWithInitialData';
import { ViewTreeData } from 'pages/api/views/tree';

interface PeoplePageClientProps {
  orgId: number;
  viewTree: ViewTreeData;
}

export default function PeoplePageClient({
  orgId,
  viewTree,
}: PeoplePageClientProps) {
  return (
    <PeopleLayout>
      <Suspense fallback={<ViewBrowserSkeleton />}>
        <ViewBrowserWithInitialData
          basePath={`/organize/${orgId}/people`}
          viewTree={viewTree}
        />
      </Suspense>
    </PeopleLayout>
  );
}
