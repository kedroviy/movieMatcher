import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { SimpleButton } from 'shared';
import { Color } from 'styles/colors';

type MatchScreenLobbyActionsRowProps = {
    createTitle: string;
    joinTitle: string;
    onCreate: () => void;
    onJoin: () => void;
    createDisabled: boolean;
    joinDisabled: boolean;
};

export const MatchScreenLobbyActionsRow: FC<MatchScreenLobbyActionsRowProps> = ({
    createTitle,
    joinTitle,
    onCreate,
    onJoin,
    createDisabled,
    joinDisabled,
}) => {
    return (
        <View style={styles.row}>
            <View style={styles.slot}>
                <SimpleButton
                    title={createTitle}
                    color={Color.BUTTON_RED}
                    titleColor={Color.WHITE}
                    buttonWidth="100%"
                    onHandlePress={onCreate}
                    disabled={createDisabled}
                    buttonStyle={styles.createButton}
                    titleStyle={styles.buttonTitle}
                />
            </View>
            <View style={styles.slot}>
                <SimpleButton
                    title={joinTitle}
                    color={Color.EXTRA_DARK_GRAY}
                    titleColor={Color.WHITE}
                    buttonWidth="100%"
                    onHandlePress={onJoin}
                    disabled={joinDisabled}
                    buttonStyle={styles.joinButtonOutline}
                    titleStyle={styles.buttonTitle}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        width: '100%',
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 10,
        marginBottom: 12,
    },
    /** Equal columns so long RU labels wrap instead of squeezing one side. */
    slot: {
        flex: 1,
        minWidth: 0,
    },
    createButton: {
        paddingHorizontal: 10,
        paddingVertical: 11,
    },
    joinButtonOutline: {
        paddingHorizontal: 10,
        paddingVertical: 11,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Color.GREY,
    },
    buttonTitle: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '600',
    },
});
