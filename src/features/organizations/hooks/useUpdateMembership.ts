import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinMembership } from 'utils/types/zetkin';
import { userMembershipsLoaded } from '../store';
import useMemberships from './useMemberships';

type MembershipUpdate = {
  follow?: boolean;
  // email_notifications can be added here when backend supports it
};

export default function useUpdateMembership() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const memberships = useMemberships();

  const updateMembership = async (
    orgId: number,
    updates: MembershipUpdate
  ): Promise<void> => {
    // Update via API
    await apiClient.patch(`/api/users/me/memberships/${orgId}`, updates);

    // Optimistically update local state
    if (memberships.data) {
      const updatedMemberships = memberships.data.map((membership) => {
        if (membership.organization.id === orgId) {
          return {
            ...membership,
            ...updates,
          };
        }
        return membership;
      });
      dispatch(userMembershipsLoaded(updatedMemberships));
    }
  };

  return updateMembership;
}
