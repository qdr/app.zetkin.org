import { useEffect } from 'react';
import shouldLoad from 'core/caching/shouldLoad';
import useServerSide from 'core/useServerSide';
import { ZetkinUser } from 'utils/types/zetkin';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { userLoad, userLoaded } from '../store';

const useCurrentUser = () => {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const isServer = useServerSide();

  useEffect(() => {
    if (isServer) {
      return;
    }

    if (shouldLoad(userState.userItem)) {
      dispatch(userLoad());
      apiClient.get<ZetkinUser>(`/api/users/me`).then((user) => {
        dispatch(userLoaded(user));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServer, userState.userItem]);

  if (isServer) {
    return null;
  }

  return userState.userItem.data;
};

export default useCurrentUser;
