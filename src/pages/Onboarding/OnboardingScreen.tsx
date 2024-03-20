import { FC, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { PAGES } from './constants';
import { OnboardingCard } from "./ui";

export const OnboardingScreen: FC = () => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    
    const handleNextPage = async () => {
        if (currentPageIndex < PAGES.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
        } else {
            await AsyncStorage.setItem('ONBOARDED', 'onboarded');
            navigation.navigate('TabNavigator');
        }
    };

    return (
        <OnboardingCard
            {...PAGES[currentPageIndex]}
            onHandlePress={handleNextPage}
        />
    )
}
