'use server';

import { FC, Suspense } from 'react';

import PublicOrgPage from 'features/organizations/pages/PublicOrgPage';
import PublicOrgPageSkeleton from 'features/organizations/components/PublicOrgPageSkeleton';

type Props = {
  params: {
    orgId: number;
  };
};

const Page: FC<Props> = ({ params }) => {
  return (
    <Suspense fallback={<PublicOrgPageSkeleton />}>
      <PublicOrgPage orgId={params.orgId} />
    </Suspense>
  );
};

export default Page;
