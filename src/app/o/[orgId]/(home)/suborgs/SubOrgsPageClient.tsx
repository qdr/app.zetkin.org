'use client';

import { FC } from 'react';

import { ZetkinSubOrganization } from 'utils/types/zetkin';
import SubOrgsPageWithInitialData from 'features/organizations/components/SubOrgsPageWithInitialData';

interface Props {
  orgId: number;
  subOrgs: ZetkinSubOrganization[];
}

const SubOrgsPageClient: FC<Props> = ({ orgId, subOrgs }) => {
  return <SubOrgsPageWithInitialData orgId={orgId} subOrgs={subOrgs} />;
};

export default SubOrgsPageClient;
