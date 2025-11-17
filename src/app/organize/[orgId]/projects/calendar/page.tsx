'use client';

import BackendApiClient from 'core/api/client/BackendApiClient';
import Calendar from 'features/calendar/components';
import { useParams } from 'next/navigation';
import useServerSide from 'core/useServerSide';

export const metadata = {
  title: 'Calendar - Zetkin',
};

export default function ProjectsCalendarPage() {
  const onServer = useServerSide();
  const params = useParams();
  const orgId = parseInt(params.orgId as string);

  if (onServer) {
    return null;
  }

  return (
    <Calendar
      apiClient={new BackendApiClient()}
      orgId={orgId}
    />
  );
}
