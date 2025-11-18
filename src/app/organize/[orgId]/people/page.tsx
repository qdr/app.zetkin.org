'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';

import messageIds from 'features/views/l10n/messageIds';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import ViewBrowser from 'features/views/components/ViewBrowser';
import ViewBrowserSkeleton from 'features/views/components/ViewBrowserSkeleton';

export default function PeopleViewsPage() {
  const params = useParams();
  const orgId = parseInt(params.orgId as string);

  return <ViewBrowser basePath={`/organize/${orgId}/people`} />;
  return (
    <PeopleLayout>
      <Suspense fallback={<ViewBrowserSkeleton />}>
        <ViewBrowser basePath={`/organize/${orgId}/people`} />
      </Suspense>
    </PeopleLayout>
  );
}
