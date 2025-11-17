import { ReactNode } from 'react';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';

export default function CampaignLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SingleCampaignLayout>{children}</SingleCampaignLayout>;
}
