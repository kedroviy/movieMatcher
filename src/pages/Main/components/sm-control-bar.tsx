import { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { CloseSvgIcon, LikeSvgIcon } from 'shared';
import { Color } from 'styles/colors';

type SMControlBarType = {
    onHandleLike: () => void;
    onHandleDislike: () => void;
};

const hitSlop = { top: 12, bottom: 12, left: 12, right: 12 };

export const SMControlBar: FC<SMControlBarType> = ({ onHandleLike, onHandleDislike }) => {
    return (
        <>
            <TouchableOpacity
                activeOpacity={0.75}
                hitSlop={hitSlop}
                style={{
                    width: 70,
                    height: 70,
                    backgroundColor: Color.GRAY_BROWN,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 35,
                    marginVertical: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.12)',
                }}
                onPress={onHandleDislike}
            >
                <CloseSvgIcon stroke={Color.WHITE} width={32} height={32} />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.75}
                hitSlop={hitSlop}
                style={{
                    width: 70,
                    height: 70,
                    backgroundColor: Color.BUTTON_RED,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 35,
                    marginVertical: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                }}
                onPress={onHandleLike}
            >
                <LikeSvgIcon stroke={Color.WHITE} fill={Color.WHITE} width={32} height={32} />
            </TouchableOpacity>
        </>
    );
};
