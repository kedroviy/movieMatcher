import { View, Text, StyleSheet } from "react-native";
import {
    GoogleSignin,
    GoogleSigninButton,
    User,
} from '@react-native-google-signin/google-signin';
import { useEffect, useState } from "react";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF5F1',
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
    },
});


export const LoginScreen = () => {
    const [user, setUser] = useState<User | undefined>();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '277043180680-qdj0s8aiqvf24rpj411ertlp3liv4gj7.apps.googleusercontent.com',
            offlineAccess: true,
            forceCodeForRefreshToken: true,
        });
        isSignedIn();
        console.log('user: ', user)
    }, []);

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo: User = await GoogleSignin.signIn();
            console.log('__due__ :', userInfo)
            setUser(userInfo)

        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    };

    const isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (!!isSignedIn) {
            getCurrentUserInfo()
        } else {
            console.log('please login')
        }
    };

    const getCurrentUserInfo = async () => {
        try {
            const userInfo: User = await GoogleSignin.signInSilently();
            console.log('currentUserInfo: ', userInfo)

            setUser(userInfo);
        } catch (error) {
            if (error) {
                console.log('Error message: ', error)
            }
        }
    };

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            setUser({ user: null } as unknown as User);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Login page</Text>

            <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={signIn}
            />

        </View>
    )
}
