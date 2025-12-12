import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import { eventResponseAdded, eventResponseRemoved } from '../store';

export default function useEventCallActions(
  orgId: number,
  eventId: number,
  personId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    async signUp() {
      if (personId) {
        await apiClient.put<{ action: ZetkinEvent }>(
          `/api/orgs/${orgId}/actions/${eventId}/responses/${personId}`
        );
        dispatch(eventResponseAdded(eventId));
      }
    },
    async undoSignup() {
      if (personId) {
        await apiClient.delete(
          `/api/orgs/${orgId}/actions/${eventId}/responses/${personId}`
        );
      }
      dispatch(eventResponseRemoved(eventId));
    },
  };
}
