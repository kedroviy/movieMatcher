import NetInfo from '@react-native-community/netinfo';
import { setNetworkStatus } from '../redux/appSlice';
import { PayloadAction } from '@reduxjs/toolkit';

const networkMiddleware = (store: { dispatch: (arg0: { payload: boolean; type: "app/setNetworkStatus"; }) => void; }) => {
    NetInfo.addEventListener((state) => {
        const isConnected = state.isConnected ?? false;
        store.dispatch(setNetworkStatus(isConnected));
    });

    return (next: (arg0: PayloadAction) => PayloadAction<boolean>) => (action: PayloadAction) => {
        return next(action);
    };
};

export default networkMiddleware;
