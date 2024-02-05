import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Navigation } from './Navigation';

export default function AppContainer() {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    return (
        <NavigationContainer>
            <SafeAreaView
                style={[
                    backgroundStyle,
                    { flex: 1 }
                ]}>
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor="#669bbc"
                />
                <Navigation />
            </SafeAreaView>
        </NavigationContainer>
    );
}
