import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinJourney } from 'utils/types/zetkin';
import NewJourneyPageClient from './NewJourneyPageClient';

export const metadata: Metadata = {
  title: 'New Journey Instance - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; journeyId: string }>;
  searchParams: Promise<{ subject?: string | string[] }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { orgId, journeyId } = await params;
  const search = await searchParams;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  try {
    await apiClient.get<ZetkinJourney>(
      `/api/orgs/${orgId}/journeys/${journeyId}`
    );

    const inputSubjectIds = search.subject
      ? Array.isArray(search.subject)
        ? search.subject
        : [search.subject]
      : [];
    const subjectId = inputSubjectIds[0];

    return (
      <NewJourneyPageClient
        orgId={orgId}
        journeyId={journeyId}
        subjectId={subjectId}
      />
    );
  } catch {
    notFound();
  }
}
