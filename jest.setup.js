jest.mock('react-native-gesture-handler', () => {
  return {
    TouchableOpacity: require('react-native').TouchableOpacity,
  };
});
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));