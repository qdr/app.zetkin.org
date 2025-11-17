'use client';

import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function EventsRedirect() {
  const params = useParams();
  const orgId = params.orgId as string;
  const campId = params.campId as string;

  useEffect(() => {
    if (campId === 'standalone') {
      redirect(`/organize/${orgId}/projects/calendar`);
    } else {
      redirect(`/organize/${orgId}/projects/${campId}/calendar`);
    }
  }, [orgId, campId]);

  return null;
}
