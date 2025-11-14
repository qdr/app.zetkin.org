import { ReactNode } from 'react';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';

interface OrganizeLayoutProps {
  children: ReactNode;
  params: {
    orgId: string;
  };
}

export default async function OrganizeLayout({
  children,
  params,
}: OrganizeLayoutProps) {
  // Require level 2 authentication (2FA) for all organize pages
  await redirectIfLoginNeeded(2);

  // Note: Layout-specific UI components can be added here
  // For now, just pass through children
  return <>{children}</>;
}
