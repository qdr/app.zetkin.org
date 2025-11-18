import { Metadata } from 'next';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import EmailComposePageClient from './EmailComposePageClient';

export const metadata: Metadata = {
  title: 'Compose Email - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; emailId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, emailId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return <EmailComposePageClient orgId={parseInt(orgId)} emailId={parseInt(emailId)} />;
}
