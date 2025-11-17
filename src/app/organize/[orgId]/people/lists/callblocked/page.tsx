'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import { useNumericRouteParams } from 'core/hooks';

const CallBlockedPage = () => {
  const { orgId } = useNumericRouteParams();

  useEffect(() => {
    // Redirect to main people page since useOrganizerActionView hook no longer exists
    // This was a special system view that is no longer supported
    redirect(`/organize/${orgId}/people`);
  }, [orgId]);

  return null;
};

export default CallBlockedPage;
