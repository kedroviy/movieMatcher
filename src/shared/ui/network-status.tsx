import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { View, Text } from 'react-native';
import { RootState } from 'redux/configure-store';

type NetworkStatusType = {
    status: string;
}
const NetworkStatus: FC<NetworkStatusType> = ({status}) => {
  const isConnected = useSelector((state: RootState) => state.appSlice);

  if (!isConnected) {
    return (
      <View style={{ padding: 10, backgroundColor: 'red' }}>
        <Text style={{ color: 'white' }}>{status}</Text>
      </View>
    );
  }

  return null;
};

export default NetworkStatus;
