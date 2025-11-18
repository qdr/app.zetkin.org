import { getServerApiClient } from 'core/api/server';
import PersonManagePageClient from './PersonManagePageClient';
import { ZetkinPerson } from 'utils/types/zetkin';

type PageProps = {
  params: {
    orgId: string;
    personId: string;
  };
};

export default async function PersonManagePage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const personId = parseInt(params.personId);

  const apiClient = await getServerApiClient();

  const person = await apiClient.get<ZetkinPerson>(
    `/api/orgs/${orgId}/people/${personId}`
  );

  return <PersonManagePageClient orgId={orgId} person={person} personId={personId} />;
}
