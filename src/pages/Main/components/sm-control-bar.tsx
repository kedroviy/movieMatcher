import { FC } from "react";
import { TouchableOpacity } from "react-native";
import { CloseSvgIcon, LikeSvgIcon } from "shared";
import { Color } from "styles/colors";

type SMControlBarType = {
    onHandleLike: () => void,
    onHandleDislike: () => void,
}

export const SMControlBar: FC<SMControlBarType> = ({ onHandleLike, onHandleDislike }) => {
    return (
        <>
            <TouchableOpacity
                style={{
                    width: 70,
                    height: 70,
                    backgroundColor: Color.GRAY_BROWN,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 35,
                    marginVertical: 8
                }}
                onPress={onHandleDislike}
            >
                <CloseSvgIcon stroke={Color.WHITE} width={32} height={32} />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: 70,
                    height: 70,
                    backgroundColor: Color.BUTTON_RED,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 35,
                    marginVertical: 8
                }}
                onPress={onHandleLike}
            >
                <LikeSvgIcon stroke={Color.WHITE} fill={Color.WHITE} width={32} height={32} />
            </TouchableOpacity>
        </>
    )
};
