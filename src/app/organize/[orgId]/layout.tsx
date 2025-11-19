import { ReactNode } from 'react';

import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';

export default async function OrganizeOrgLayout({
  children,
}: {
  children: ReactNode;
  params: { orgId: string };
}) {
  // Require 2FA for all organize pages
  await redirectIfLoginNeeded(2);

  return <>{children}</>;
}
