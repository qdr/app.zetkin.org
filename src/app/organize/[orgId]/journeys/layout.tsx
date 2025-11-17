import { ReactNode } from 'react';
import JourneysLayout from 'features/journeys/layout/JourneysLayout';

export default function JourneysSection({
  children,
}: {
  children: ReactNode;
}) {
  return <JourneysLayout>{children}</JourneysLayout>;
}
