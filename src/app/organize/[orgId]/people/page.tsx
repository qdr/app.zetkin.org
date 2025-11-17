'use client';

import { useParams } from 'next/navigation';

import messageIds from 'features/views/l10n/messageIds';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import ViewBrowser from 'features/views/components/ViewBrowser';

export default function PeopleViewsPage() {
  const params = useParams();
  const orgId = parseInt(params.orgId as string);
  const onServer = useServerSide();
  const messages = useMessages(messageIds);

  if (onServer) {
    return null;
  }

  return (
    <PeopleLayout>
      <ViewBrowser basePath={`/organize/${orgId}/people`} />
    </PeopleLayout>
  );
}
