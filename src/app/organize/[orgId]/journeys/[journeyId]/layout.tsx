import { ReactNode } from 'react';
import AllJourneyInstancesLayout from 'features/journeys/layout/AllJourneyInstancesLayout';

export default function JourneyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AllJourneyInstancesLayout>{children}</AllJourneyInstancesLayout>;
}
