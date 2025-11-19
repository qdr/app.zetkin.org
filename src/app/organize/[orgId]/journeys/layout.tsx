'use client';

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import JourneysLayout from 'features/journeys/layout/JourneysLayout';

export default function JourneysSection({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();

  // Don't wrap with JourneysLayout when viewing a specific journey
  // The journey has its own AllJourneyInstancesLayout
  if (params?.journeyId) {
    return <>{children}</>;
  }

  return <JourneysLayout>{children}</JourneysLayout>;
}
