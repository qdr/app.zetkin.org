'use client';

import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Events - Zetkin',
};

export default function CampaignEventsPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const campId = params.campId as string;

  // Redirect to calendar view which shows all events
  redirect(`/organize/${orgId}/projects/${campId}/calendar`);
}
