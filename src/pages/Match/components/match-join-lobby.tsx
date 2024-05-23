import { FC, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { AppRoutes } from "app/constants";
import { AppDispatch } from "redux/configure-store";
import { joinRoom } from "redux/matchSlice";
import { AppConstants, Loader, SimpleButton, SimpleInput } from "shared"
import { Color } from "styles/colors";

const { width } = Dimensions.get('window');

export const MatchJoinLobby: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { user } = useSelector((state: any) => state.userSlice);
    const { loading, error, room } = useSelector((state: any) => state.matchSlice);
    const [key, setKey] = useState<string>(AppConstants.EMPTY_VALUE);
    const [isFormValidInput, setIsFormValidInput] = useState<boolean>(false);

    useEffect(() => {
        console.log('room key: ', room)
        if (room.roomKey && !loading) {
            navigation.navigate(AppRoutes.MATCH_NAVIGATOR, {
                screen: AppRoutes.MATCH_LOBBY,
                params: { lobbyName: room.roomKey },
            });
        }
    }, [loading, error]);

    const onChangeKey = (input: string) => {
        if (!isNaN(Number(input))) {
            setKey(input);
        }
    };

    const handleValidationInput = (isValid: boolean) => {
        setIsFormValidInput(isValid);
    };

    const onHandleSubmit = (userId: number) => {
        if (isFormValidInput) {
            console.log({key, userId})
            dispatch(joinRoom({ key: Number(key), userId: userId }))
            .unwrap()
                .then((newRoom: any) => {
                    console.log('join to room:', newRoom);
                    navigation.navigate(AppRoutes.MATCH_NAVIGATOR, {
                        screen: AppRoutes.MATCH_LOBBY,
                        params: { lobbyName: key },
                    });
                })
                .catch((errMsg) => {
                    console.error('Error creating room:', errMsg);
                });
        }
    }

    return (
        <View style={styles.container}>
            <SimpleInput
                label='Lobby key'
                onChangeText={onChangeKey}
                onValidationChange={handleValidationInput}
                value={key}
                placeholder='Enter lobby key'
                textError={!isFormValidInput && key.length > 0 ? 'Key must be numeric and 6 chars long' : undefined}
            />
            <SimpleButton
                title='Enter to lobby'
                color={Color.BUTTON_RED}
                titleColor={Color.WHITE}
                buttonWidth={width - 32}
                onHandlePress={() => onHandleSubmit(1)}
            />
            {loading ? <Loader /> : null}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.BACKGROUND_GREY,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 32,
    },
    text: {

        color: Color.WHITE
    }
});