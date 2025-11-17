'use client';

import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function EmailsRedirect() {
  const params = useParams();
  const orgId = params.orgId as string;
  const campId = params.campId as string;

  useEffect(() => {
    redirect(`/organize/${orgId}/projects/${campId}`);
  }, [orgId, campId]);

  return null;
}
