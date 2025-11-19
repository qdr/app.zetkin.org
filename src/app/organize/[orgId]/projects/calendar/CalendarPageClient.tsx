'use client';

import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import Calendar from 'features/calendar/components';

export default function CalendarPageClient() {
  return (
    <AllCampaignsLayout fixedHeight>
      <Calendar />
    </AllCampaignsLayout>
  );
}
