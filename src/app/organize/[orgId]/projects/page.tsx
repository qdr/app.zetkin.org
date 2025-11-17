import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import ProjectsClient from './ProjectsClient';

export const metadata = {
  title: 'Projects - Zetkin',
};

export default async function ProjectsPage({
  params,
}: {
  params: { orgId: string };
}) {
  const { orgId } = params;

  const headersList = headers();
  const headersObject = Object.fromEntries(headersList.entries());
  const apiClient = new BackendApiClient(headersObject);

  try {
    await apiClient.get(`/api/orgs/${orgId}`);
  } catch {
    notFound();
  }

  return (
    <AllCampaignsLayout>
      <ProjectsClient orgId={orgId} />
    </AllCampaignsLayout>
  );
}
