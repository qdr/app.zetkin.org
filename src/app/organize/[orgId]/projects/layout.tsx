import { ReactNode } from 'react';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';

export default function ProjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AllCampaignsLayout>{children}</AllCampaignsLayout>;
}
