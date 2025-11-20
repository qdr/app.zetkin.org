'use client';

import { FC, useEffect } from 'react';

import { ZetkinSubOrganization } from 'utils/types/zetkin';
import { useAppDispatch } from 'core/hooks';
import { subOrgsLoaded } from '../store';
import SubOrgsPage from '../pages/SubOrgsPage';

interface Props {
  orgId: number;
  subOrgs: ZetkinSubOrganization[];
}

const SubOrgsPageWithInitialData: FC<Props> = ({ orgId, subOrgs }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(subOrgsLoaded([orgId, subOrgs]));
  }, [orgId, subOrgs, dispatch]);

  return <SubOrgsPage orgId={orgId} />;
};

export default SubOrgsPageWithInitialData;
