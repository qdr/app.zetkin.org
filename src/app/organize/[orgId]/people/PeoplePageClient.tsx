'use client';

import { FC } from 'react';

import PeopleLayout from 'features/views/layout/PeopleLayout';
import ViewBrowser from 'features/views/components/ViewBrowser';

interface PeoplePageClientProps {
  orgId: string;
}

const PeoplePageClient: FC<PeoplePageClientProps> = ({ orgId }) => {
  return (
    <PeopleLayout>
      <ViewBrowser basePath={`/organize/${orgId}/people`} />
    </PeopleLayout>
  );
};

export default PeoplePageClient;
