'use client';

<<<<<<< HEAD
import { useEffect } from 'react';

import PublicOrgPage from '../pages/PublicOrgPage';
import { orgEventsLoaded, organizationLoaded } from '../store';
import { userEventsLoaded } from 'features/events/store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

interface PublicOrgPageWithInitialDataProps {
  myEvents: ZetkinEventWithStatus[];
  orgEvents: ZetkinEvent[];
  orgId: number;
  organization: ZetkinOrganization;
}

/**
 * Wrapper around PublicOrgPage that pre-populates Redux store
 * with server-fetched organization events and details for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function PublicOrgPageWithInitialData({
  myEvents,
  orgEvents,
  orgId,
  organization,
}: PublicOrgPageWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched data
    dispatch(orgEventsLoaded([orgId, orgEvents]));
    dispatch(organizationLoaded(organization));
    if (myEvents.length > 0) {
      dispatch(userEventsLoaded(myEvents));
    }
  }, [myEvents, orgEvents, orgId, organization, dispatch]);

  // Render the existing PublicOrgPage which will use the hydrated store
  return <PublicOrgPage orgId={orgId} />;
}
=======
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

  return <PublicOrgPage orgId={orgId} />;
};

export default PublicOrgPageWithInitialData;
>>>>>>> 44bc9c466da9b5e96bcb7cabdc3ad91c664aac94
