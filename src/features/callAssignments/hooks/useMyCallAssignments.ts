import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { userAssignmentsLoad, userAssignmentsLoaded } from '../store';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

export default function useMyCallAssignments() {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.callAssignments.userAssignmentList
  );

  const assignments = useRemoteList(list, {
    actionOnLoad: () => userAssignmentsLoad(),
    actionOnSuccess: (data) => userAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinCallAssignment[]>(`/api/users/me/call_assignments`),
  });

  const now = new Date();
  // Subtract 120 days for testing purposes
  now.setDate(now.getDate() - 120);
  const today = now.toISOString().slice(0, 10);

  console.log('[useMyCallAssignments] Today:', today);
  console.log('[useMyCallAssignments] All assignments:', assignments);

  const filtered = assignments.filter(
    ({ end_date, start_date }) => {
      const include = start_date && (end_date == null || end_date >= today);
      console.log('[useMyCallAssignments] Assignment:', { start_date, end_date, include });
      return include;
    }
  );

  console.log('[useMyCallAssignments] Filtered:', filtered);

  return filtered;
}
