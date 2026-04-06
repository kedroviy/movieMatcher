import { FC, useState } from "react";
import { Dimensions, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "redux/configure-store";
import { deleteUser } from "redux/userSlice";
import { CloseSvgIcon, SimpleButton } from "shared";
import { Color } from "styles/colors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "app/constants";
import { logout } from "redux/authSlice";

const windowWidth = Dimensions.get('window').width;

enum DeleteState {
    INITIAL = 0,
    CONFIRM = 1,
    EMAIL_INPUT = 2
}

type UPDAModalType = {
    onHandlePress: () => void,
};

export const UPDAModal: FC<UPDAModalType> = ({ onHandlePress }) => {
    const { user } = useSelector((state: RootState) => state.userSlice);
    
    const dispatch: AppDispatch = useDispatch();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [deleteState, setDeleteState] = useState<DeleteState>(DeleteState.INITIAL);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleDeleteClick = async () => {
        if (deleteState === DeleteState.INITIAL) {
            setDeleteState(DeleteState.CONFIRM);
        } else if (deleteState === DeleteState.CONFIRM) {
            setDeleteState(DeleteState.EMAIL_INPUT);
        } else if (deleteState === DeleteState.EMAIL_INPUT) {
            if (email === user?.email) {
                try {
                    const resultAction = await dispatch(deleteUser(email));
                    if (deleteUser.fulfilled.match(resultAction)) {
                        dispatch(logout());
                    } else {
                        setError('Failed to delete account. Please try again.');
                    }
                } catch (error) {
                    setError('An error occurred during account deletion.');
                    console.error(error);
                }
            } else {
                setError('Incorrect email. Please enter your correct email.');
            }
        }
    };

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
        }}>
            <View style={{
                width: windowWidth - 32,
                flex: 0.3,
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: 5,
                backgroundColor: Color.PRIMARY_DARK,
            }}>
                <View style={{
                    width: '100%',
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: Color.BACKGROUND_GREY,
                    marginTop: 5,
                    paddingHorizontal: 16,
                }}>
                    <Text style={{
                        color: Color.WHITE,
                        fontSize: 16,
                    }}>
                        Delete {user?.username}
                    </Text>
                    <TouchableOpacity
                        style={{
                            width: 28,
                            height: 28,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Color.GRAY_BROWN,
                            borderRadius: 14,
                        }}
                        onPress={onHandlePress}
                    >
                        <CloseSvgIcon stroke={Color.FADED_WHITE} width={22} height={22} />
                    </TouchableOpacity>
                </View>

                {deleteState === DeleteState.INITIAL && (
                    <><View style={{
                        width: '100%',
                        height: 90,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: Color.BACKGROUND_GREY,
                        marginTop: 5,
                    }}>
                        <Text style={{
                            color: Color.WHITE,
                            fontSize: 21,
                            fontWeight: '500',
                            lineHeight: 20.8,
                        }}>
                            {user?.username}
                        </Text>
                    </View><View style={{
                        width: '100%',
                        height: 90,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 5,
                    }}>
                            <SimpleButton
                                title='I want to delete my account'
                                color={Color.SYSTEM_GREY}
                                titleColor={Color.WHITE}
                                onHandlePress={handleDeleteClick}
                                buttonWidth={windowWidth - 64} />
                        </View></>
                )}

                {deleteState === DeleteState.CONFIRM && (
                    <View style={{
                        width: '100%',
                        height: '80%',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginTop: 5,
                        paddingVertical: 16,
                    }}>
                        <Text style={{
                            color: Color.RED,
                            fontSize: 16,
                            marginBottom: 10,
                        }}>
                            Are you sure? Clicking again will delete your account permanently.
                        </Text>
                        <SimpleButton
                            title='Yes, delete my account'
                            color={Color.SYSTEM_GREY}
                            titleColor={Color.WHITE}
                            onHandlePress={handleDeleteClick}
                            buttonWidth={windowWidth - 64}
                        />
                    </View>
                )}

                {deleteState === DeleteState.EMAIL_INPUT && (
                    <View style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 5,
                    }}>
                        <Text style={{
                            color: Color.WHITE,
                            fontSize: 16,
                            marginBottom: 10,
                        }}>
                            To confirm, type "{user?.email}" in the box below
                        </Text>
                        <TextInput
                            style={{
                                width: windowWidth - 64,
                                height: 40,
                                backgroundColor: Color.BACKGROUND_GREY,
                                color: Color.WHITE,
                                paddingHorizontal: 10,
                                borderRadius: 5,
                                marginBottom: 10,
                            }}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor={Color.GRAY_BROWN}
                        />
                        {error && (
                            <Text style={{ color: Color.RED, marginBottom: 10 }}>
                                {error}
                            </Text>
                        )}
                        <SimpleButton
                            title='Confirm and delete'
                            color={Color.RED}
                            titleColor={Color.WHITE}
                            onHandlePress={handleDeleteClick}
                            buttonWidth={windowWidth - 64}
                        />
                    </View>
                )}
            </View>
        </View >
    );
};
