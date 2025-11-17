import { ReactNode } from 'react';
import PeopleLayout from 'features/views/layout/PeopleLayout';

export default function PeopleSection({
  children,
}: {
  children: ReactNode;
}) {
  return <PeopleLayout>{children}</PeopleLayout>;
}
