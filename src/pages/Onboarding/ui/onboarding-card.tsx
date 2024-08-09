import { FC } from "react"
import { View, Image, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { OnboardingPagination } from "./onboarding-pagination";
import { PAGES } from "../constants";

type OnboardingCardType = {
    id: number;
    imageUrl: string;
    header: string;
    subHeader: string;
    buttonText: string;
    onHandlePress: () => void;
}

export const OnboardingCard: FC<OnboardingCardType> = ({ id, imageUrl, header, subHeader, buttonText, onHandlePress }) => {
    const windowWidth = Dimensions.get('window').width;

    return (
        <View
            style={[styles.container, { width: windowWidth }]}
        >
            <View style={{ width: windowWidth - 12, height: 328, top: 40 }}>
                <Image
                    style={{
                        width: '100%',
                        height: '100%',

                    }}
                    source={{ uri: imageUrl }}

                />
            </View>
            <View style={{ width: 328, gap: 12, alignItems: 'center' }}>
                <Text style={{
                    color: '#F9F9F9',
                    fontSize: 22,
                    fontWeight: '700',
                    lineHeight: 27.5,
                    textAlign: 'center'
                }}>{header}</Text>
                <Text style={{
                    color: '#F9F9F9',
                    fontSize: 16,
                    fontWeight: '400',
                    lineHeight: 21.6,
                    textAlign: 'center'
                }}>{subHeader}</Text>
            </View>
            <View style={{ bottom: 30 }}>
                <OnboardingPagination totalPages={PAGES.length} currentPage={id} />
            </View>
            <View>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            flexDirection: 'row',
                            width: windowWidth - 32,
                            height: 48,
                            backgroundColor: '#ED0E0E',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }
                    ]}
                    onPress={onHandlePress}
                    testID='myButton'
                >
                    <Text style={{
                        color: '#F9F9F9',
                        fontSize: 18,
                        fontWeight: '500',
                    }}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#353535',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#595959',
        padding: 10,
        width: 328,
        height: 44,
        gap: 10,
        borderRadius: 5,
    },
});