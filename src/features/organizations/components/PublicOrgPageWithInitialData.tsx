'use client';

import { FC, useEffect } from 'react';

import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import { useAppDispatch } from 'core/hooks';
import { organizationLoaded, orgEventsLoaded } from '../store';
import { userEventsLoaded } from 'features/events/store';
import PublicOrgPage from '../pages/PublicOrgPage';

interface Props {
  organization: ZetkinOrganization;
  orgEvents: ZetkinEvent[];
  orgId: number;
  userEvents: ZetkinEventWithStatus[];
}

const PublicOrgPageWithInitialData: FC<Props> = ({
  organization,
  orgEvents,
  orgId,
  userEvents,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(organizationLoaded(organization));
    dispatch(orgEventsLoaded([orgId, orgEvents]));
    dispatch(userEventsLoaded(userEvents));
  }, [organization, orgEvents, orgId, userEvents, dispatch]);

  return <PublicOrgPage organization={organization} orgId={orgId} />;
};

export default PublicOrgPageWithInitialData;
