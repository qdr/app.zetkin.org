import { getServerApiClient } from 'core/api/server';
import PersonProfilePageClient from './PersonProfilePageClient';
import {
  ZetkinAppliedTag,
  ZetkinCustomField,
  ZetkinJourney,
  ZetkinPerson,
} from 'utils/types/zetkin';

type PageProps = {
  params: {
    orgId: string;
    personId: string;
  };
};

// Server Component - pre-fetches person profile data for faster initial render
export default async function PersonProfilePage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const personId = parseInt(params.personId);

  const apiClient = await getServerApiClient();

  // Pre-fetch all person data in parallel
  const [person, customFields, personTags, journeys] = await Promise.all([
    apiClient.get<ZetkinPerson>(`/api/orgs/${orgId}/people/${personId}`),
    apiClient.get<ZetkinCustomField[]>(`/api/orgs/${orgId}/people/fields`),
    apiClient.get<ZetkinAppliedTag[]>(
      `/api/orgs/${orgId}/people/${personId}/tags`
    ),
    apiClient.get<ZetkinJourney[]>(`/api/orgs/${orgId}/journeys`),
  ]);

  return (
    <PersonProfilePageClient
      customFields={customFields}
      journeys={journeys}
      orgId={orgId}
      person={person}
      personId={personId}
      personTags={personTags}
    />
  );
}
