import { Metadata } from 'next';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import ConversationPageClient from './ConversationPageClient';

export const metadata: Metadata = {
  title: 'Call Assignment Conversation - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; callAssId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, callAssId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return <ConversationPageClient orgId={parseInt(orgId)} callAssId={parseInt(callAssId)} />;
}
