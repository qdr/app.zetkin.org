import { getServerApiClient } from 'core/api/server';
import { PotentialDuplicate } from 'features/duplicates/store';
import DuplicatesPageClient from './DuplicatesPageClient';

type PageProps = {
  params: {
    orgId: string;
  };
};

export default async function DuplicatesPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);

  const apiClient = await getServerApiClient();

  const duplicates = await apiClient.get<PotentialDuplicate[]>(
    `/api/orgs/${orgId}/people/duplicates?filter=status==pending`
  );

  return <DuplicatesPageClient duplicates={duplicates} orgId={orgId} />;
}
