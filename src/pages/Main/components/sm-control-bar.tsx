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
                    backgroundColor: '#FFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    marginVertical: 8
                }}
                onPress={onHandleDislike}
            >
                <CloseSvgIcon stroke={Color.BLACK} width={32} height={32} />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: 70,
                    height: 70,
                    backgroundColor: '#FFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    marginVertical: 8
                }}
                onPress={onHandleLike}
            >
                <LikeSvgIcon stroke={Color.BLACK} width={32} height={32} />
            </TouchableOpacity>
        </>
    )
};
