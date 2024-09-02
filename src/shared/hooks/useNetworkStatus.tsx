import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { setNetworkStatus } from 'redux/appSlice';

const useNetworkStatus = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected ?? false;
      dispatch(setNetworkStatus(isConnected));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);
};

export default useNetworkStatus;
