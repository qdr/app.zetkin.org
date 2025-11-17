'use client';

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';

export default function ProjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();

  // Don't wrap with AllCampaignsLayout when viewing a specific campaign
  // The campaign has its own SingleCampaignLayout
  if (params?.campId) {
    return <>{children}</>;
  }

  return <AllCampaignsLayout>{children}</AllCampaignsLayout>;
}
