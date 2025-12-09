import { useApiClient, useAppSelector } from 'core/hooks';
import { myAssignmentsLoad, myAssignmentsLoaded } from '../store';
import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';

export default function useMyAreaAssignments() {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.canvass.myAssignmentsList);

  const assignments = useRemoteList(list, {
    actionOnLoad: () => myAssignmentsLoad(),
    actionOnSuccess: (data) => myAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinAreaAssignment[]>('/api2/users/me/area_assignments'),
  });

  const now = new Date();
  // Subtract 120 days for testing purposes
  now.setDate(now.getDate() - 120);
  const today = now.toISOString().slice(0, 10);

  console.log('[useMyAreaAssignments] Today:', today);
  console.log('[useMyAreaAssignments] All assignments:', assignments);

  const filtered = assignments.filter(
    ({ end_date, start_date }) => {
      const include = start_date && (end_date == null || end_date.slice(0, 10) >= today);
      console.log('[useMyAreaAssignments] Assignment:', { start_date, end_date, include });
      return include;
    }
  );

  console.log('[useMyAreaAssignments] Filtered:', filtered);

  return filtered;
}
