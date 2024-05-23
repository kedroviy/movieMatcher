import { FC } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { AppDispatch } from "redux/configure-store";
import { Color } from "styles/colors";


export type MatchUserType = {
    id: string;
    username: string;
    role: string;
};

const { width } = Dimensions.get('window');

export const MatchUserCard: FC<MatchUserType> = ({ id, username, role }) => {
    const dispatch: AppDispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { user } = useSelector((state: any) => state.userSlice);
    const { loading, error, room } = useSelector((state: any) => state.matchSlice);

    return (
        <View style={styles.container}>
            <Image
                style={{ width: 48, height: 48, borderRadius: 24, }}
                source={require('../../../../assets/iconapp.png')}
            />
            <View
                style={{
                    width: '80%',
                    alignItems: 'flex-start',
                    justifyContent: 'center'
                }}>
                <Text style={{ color: Color.WHITE }}>{username}</Text>
                <Text style={{ color: Color.SLIGHTLY_LIGHT_GRAY }}>{role}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.GRAY_BROWN,
        flexDirection: 'row',
        width: width - 32,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        padding: 5,
        marginBottom: 12,
    },
    text: {
        color: Color.WHITE
    }
});