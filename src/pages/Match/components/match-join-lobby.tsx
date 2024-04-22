import { FC, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/configure-store";
import { joinRoom } from "redux/matchSlice";
import { AppConstants, Loader, SimpleButton, SimpleInput } from "shared"
import { Color } from "styles/colors";

const { width } = Dimensions.get('window');

export const MatchJoinLobby: FC = () => {
    const [key, setKey] = useState<string>(AppConstants.EMPTY_VALUE);
    const dispatch: AppDispatch = useDispatch();
    const { user } = useSelector((state: any) => state.userSlice);
    const { loading, error, room } = useSelector((state: any) => state.matchSlice);
    const [isFormValidInput, setIsFormValidInput] = useState<boolean>(false);

    useEffect(() => {
        console.log(error)
        console.log(loading)
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
        if (isFormValidInput && user.id) {
            dispatch(joinRoom({ key: Number(key), userId: userId }));
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
                onHandlePress={() => onHandleSubmit(user.id)}
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