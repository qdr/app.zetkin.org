import { getOfficialMembershipsDef } from 'features/settings/rpc/getOfficialMemberships';
import { getServerApiClient } from 'core/api/server';
import SettingsPageClient from './SettingsPageClient';

type PageProps = {
  params: {
    orgId: string;
  };
};

export default async function SettingsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);

  const apiClient = await getServerApiClient();

  const memberships = await getOfficialMembershipsDef.handler(
    { orgId },
    apiClient
  );

  return <SettingsPageClient memberships={memberships} orgId={orgId} />;
}
