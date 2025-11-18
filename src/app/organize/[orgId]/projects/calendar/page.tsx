import CalendarPageClient from './CalendarPageClient';

interface PageProps {
  params: {
    orgId: string;
  };
}

// Server Component - no data pre-fetching yet (Calendar is complex)
// Future: Could pre-fetch events for the current month
export default async function AllCampaignsCalendarPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);

  return <CalendarPageClient orgId={orgId} />;
}
