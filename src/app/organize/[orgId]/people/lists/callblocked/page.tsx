'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import { useNumericRouteParams } from 'core/hooks';
import useOrganizerActionView from 'features/views/hooks/useOrganizerActionView';

const CallBlockedPage = () => {
  const { orgId } = useNumericRouteParams();
  const { data: view } = useOrganizerActionView(orgId);

  useEffect(() => {
    if (view) {
      redirect(`/organize/${orgId}/people/lists/${view.id}`);
    }
  }, [view, orgId]);

  return null;
};

export default CallBlockedPage;
