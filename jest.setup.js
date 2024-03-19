jest.mock('react-native-gesture-handler', () => {
    return {
      TouchableOpacity: require('react-native').TouchableOpacity,
    };
  });