import { useApiClient, useAppDispatch } from 'core/hooks';
import { userMembershipsLoaded } from '../store';
import connectToOrg from 'features/organizations/rpc/connectToOrg';
import { ApiClientError } from 'core/api/errors';
import { ZetkinMembership } from 'utils/types/zetkin';

export default function useConnectOrg(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const connectOrg = async () => {
    try {
      const result = await apiClient.rpc(connectToOrg, { orgId });

      if (result.memberships) {
        dispatch(userMembershipsLoaded(result.memberships));
      }
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 409) {
        // Already requested or already a member - refresh memberships to update UI
        const memberships = await apiClient.get<ZetkinMembership[]>(
          `/api/users/me/memberships`
        );
        dispatch(userMembershipsLoaded(memberships));
      } else {
        throw err;
      }
    }
  };

  return { connectOrg };
}
