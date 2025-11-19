import { useEffect } from 'react';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinLocation } from '../types';
import { locationsLoad, locationsLoaded } from '../store';
import shouldLoad from 'core/caching/shouldLoad';
import { loadList } from 'core/caching/cacheUtils';
import { IFuture, RemoteListFuture } from 'core/caching/futures';

export default function useLocations(
  orgId: number,
  assignmentId: number,
  areaId: number
): IFuture<ZetkinLocation[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const key = `${assignmentId}:${areaId}`;
  const locationList = useAppSelector(
    (state) => state.areaAssignments.locationsByAssignmentIdAndAreaId[key]
  );

  // Load data in useEffect to avoid dispatching during render
  useEffect(() => {
    const loadIsNecessary = shouldLoad(locationList);
    // Only load if necessary and not already loading
    if ((!locationList || loadIsNecessary) && !locationList?.isLoading) {
      loadList(dispatch, {
        actionOnLoad: () => locationsLoad(key),
        actionOnSuccess: (data) => locationsLoaded([key, data]),
        loader: () =>
          apiClient.get<ZetkinLocation[]>(
            `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations?within_areas=${areaId}&buffer_meters=50&type=assignment`
          ),
      });
    }
  }, [locationList, dispatch, key, apiClient, orgId, assignmentId, areaId]);

  // Return current state from Redux
  if (!locationList) {
    return new RemoteListFuture({ items: [], isLoading: true });
  }

  return new RemoteListFuture({
    ...locationList,
    items: locationList.items.filter((item) => !item.deleted),
  });
}
