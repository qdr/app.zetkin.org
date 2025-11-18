'use client';

import Calendar from 'features/calendar/components';

interface CalendarPageClientProps {
  orgId: number;
}

export default function CalendarPageClient({ orgId }: CalendarPageClientProps) {
  return <Calendar />;
}
