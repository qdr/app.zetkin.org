import BackendApiClient from 'core/api/client/BackendApiClient';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import ViewBrowser from 'features/views/components/ViewBrowser';
import { ZetkinView } from 'features/views/components/types';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

export const metadata = {
  title: 'People - Zetkin',
};

export default async function PeoplePage({
  params,
}: {
  params: { orgId: string };
}) {
  const { orgId } = params;

  try {
    const headersList = headers();
    const headersObject = Object.fromEntries(headersList.entries());
    const apiClient = new BackendApiClient(headersObject);
    await apiClient.get<ZetkinView[]>(`/api/orgs/${orgId}/people/views`);
  } catch {
    notFound();
  }

  return (
    <PeopleLayout>
      <ViewBrowser basePath={`/organize/${orgId}/people`} />
    </PeopleLayout>
  );
}
