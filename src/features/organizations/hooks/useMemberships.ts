import { useEffect } from 'react';

import { IFuture, RemoteListFuture } from 'core/caching/futures';
import { loadList } from 'core/caching/cacheUtils';
import shouldLoad from 'core/caching/shouldLoad';
import { ZetkinMembership } from 'utils/types/zetkin';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { userMembershipsLoad, userMembershipsLoaded } from '../store';

export default function useMemberships(): IFuture<ZetkinMembership[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const membershipList = useAppSelector(
    (state) => state.organizations.userMembershipList
  );

  // Load memberships in useEffect to avoid dispatching during render
  useEffect(() => {
    const loadIsNecessary = shouldLoad(membershipList);
    if (!membershipList || loadIsNecessary) {
      loadList(dispatch, {
        actionOnLoad: () => userMembershipsLoad(),
        actionOnSuccess: (data) => userMembershipsLoaded(data),
        loader: () =>
          apiClient
            .get<ZetkinMembership[]>(`/api/users/me/memberships`)
            .then((response) => response.filter((m) => m.role != null)),
      });
    }
  }, [membershipList, dispatch, apiClient]);

  // Return current state from Redux
  if (!membershipList) {
    return new RemoteListFuture({ items: [], isLoading: true });
  }

  return new RemoteListFuture({
    ...membershipList,
    items: membershipList.items.filter((item) => !item.deleted),
  });
}
