import React, { FC } from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

type SVGIconType = {
    stroke?: string,
    width?: number,
    height?: number,
}
export const MatchSvgIcon: FC<SVGIconType> = ({ stroke, width, height }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path id="Vector" d="M19.82 2H4.18C2.97602 2 2 2.97602 2 4.18V19.82C2 21.024 2.97602 22 4.18 22H19.82C21.024 22 22 21.024 22 19.82V4.18C22 2.97602 21.024 2 19.82 2Z" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <Path id="Vector_2" d="M7 2V22" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <Path id="Vector_3" d="M17 2V22" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <Path id="Vector_4" d="M2 12H22" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <Path id="Vector_5" d="M2 7H7" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <Path id="Vector_6" d="M2 17H7" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <Path id="Vector_7" d="M17 17H22" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <Path id="Vector_8" d="M17 7H22" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
);

export const ProfileSvgIcon: FC<SVGIconType> = ({ stroke, width, height }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path id="Vector" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <Path id="Vector_2" d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </Svg>
    )
};

export const PlaySvgIcon: FC<SVGIconType> = ({ stroke, width, height }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path d="M5 3L19 12L5 21V3Z" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
);

export const CloseSvgIcon: FC<SVGIconType> = ({ stroke, width, height }) => (
    <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
        <Path d="M24 8L8 24" stroke={stroke} stroke-width="4.66667" stroke-linecap="round" stroke-linejoin="round" />
        <Path d="M8 8L24 24" stroke={stroke} stroke-width="4.66667" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
);

export const LikeSvgIcon: FC<SVGIconType> = ({ stroke, width, height }) => (
    <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
        <Path d="M27.7871 6.14715C27.1061 5.46582 26.2976 4.92534 25.4076 4.55659C24.5177 4.18784 23.5638 3.99805 22.6005 3.99805C21.6372 3.99805 20.6833 4.18784 19.7933 4.55659C18.9034 4.92534 18.0948 5.46582 17.4138 6.14715L16.0005 7.56048L14.5871 6.14715C13.2116 4.77156 11.3459 3.99876 9.40048 3.99876C7.45511 3.99876 5.58941 4.77156 4.21382 6.14715C2.83823 7.52274 2.06543 9.38844 2.06543 11.3338C2.06543 13.2792 2.83823 15.1449 4.21382 16.5205L5.62715 17.9338L16.0005 28.3071L26.3738 17.9338L27.7871 16.5205C28.4685 15.8395 29.009 15.0309 29.3777 14.141C29.7465 13.251 29.9362 12.2971 29.9362 11.3338C29.9362 10.3705 29.7465 9.41662 29.3777 8.52667C29.009 7.63673 28.4685 6.82816 27.7871 6.14715Z" stroke={stroke} stroke-width="4.66667" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
);

export const FiltersSvgIcon: FC<Omit<SVGIconType, 'stroke'>> = ({ width, height }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path d="M22 7.25H16C15.59 7.25 15.25 6.91 15.25 6.5C15.25 6.09 15.59 5.75 16 5.75H22C22.41 5.75 22.75 6.09 22.75 6.5C22.75 6.91 22.41 7.25 22 7.25Z" fill="#F9F9F9" />
        <Path d="M6 7.25H2C1.59 7.25 1.25 6.91 1.25 6.5C1.25 6.09 1.59 5.75 2 5.75H6C6.41 5.75 6.75 6.09 6.75 6.5C6.75 6.91 6.41 7.25 6 7.25Z" fill="#F9F9F9" />
        <Path d="M10 10.75C7.66 10.75 5.75 8.84 5.75 6.5C5.75 4.16 7.66 2.25 10 2.25C12.34 2.25 14.25 4.16 14.25 6.5C14.25 8.84 12.34 10.75 10 10.75ZM10 3.75C8.48 3.75 7.25 4.98 7.25 6.5C7.25 8.02 8.48 9.25 10 9.25C11.52 9.25 12.75 8.02 12.75 6.5C12.75 4.98 11.52 3.75 10 3.75Z" fill="#F9F9F9" />
        <Path d="M22 18.25H18C17.59 18.25 17.25 17.91 17.25 17.5C17.25 17.09 17.59 16.75 18 16.75H22C22.41 16.75 22.75 17.09 22.75 17.5C22.75 17.91 22.41 18.25 22 18.25Z" fill="#F9F9F9" />
        <Path d="M8 18.25H2C1.59 18.25 1.25 17.91 1.25 17.5C1.25 17.09 1.59 16.75 2 16.75H8C8.41 16.75 8.75 17.09 8.75 17.5C8.75 17.91 8.41 18.25 8 18.25Z" fill="#F9F9F9" />
        <Path d="M14 21.75C11.66 21.75 9.75 19.84 9.75 17.5C9.75 15.16 11.66 13.25 14 13.25C16.34 13.25 18.25 15.16 18.25 17.5C18.25 19.84 16.34 21.75 14 21.75ZM14 14.75C12.48 14.75 11.25 15.98 11.25 17.5C11.25 19.02 12.48 20.25 14 20.25C15.52 20.25 16.75 19.02 16.75 17.5C16.75 15.98 15.52 14.75 14 14.75Z" fill="#F9F9F9" />
    </Svg>
);

export const PencilSvgIcon: FC = () => (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <Defs>
            <ClipPath id="clip0_1117_4575">
                <Rect width="12" height="12" fill="white" />
            </ClipPath>
        </Defs>
        <G clipPath="url(#clip0_1117_4575)">
            <Path d="M8.5 1.50015C8.63132 1.36883 8.78722 1.26466 8.9588 1.19359C9.13038 1.12252 9.31428 1.08594 9.5 1.08594C9.68572 1.08594 9.86962 1.12252 10.0412 1.19359C10.2128 1.26466 10.3687 1.36883 10.5 1.50015C10.6313 1.63147 10.7355 1.78737 10.8066 1.95895C10.8776 2.13054 10.9142 2.31443 10.9142 2.50015C10.9142 2.68587 10.8776 2.86977 10.8066 3.04135C10.7355 3.21293 10.6313 3.36883 10.5 3.50015L3.75 10.2502L1 11.0002L1.75 8.25015L8.5 1.50015Z" stroke="#F9F9F9" strokeLinecap="round" strokeLinejoin="round" />
        </G>
    </Svg>
);

export const ChevronRightSVGIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M9 18L15 12L9 6" stroke="#F9F9F9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
)

export const ChevronSvgDownIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M6 9L12 15L18 9" stroke="#F9F9F9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
)

export const ChevronSvgUpIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M6 15L12 9L18 15" stroke="#F9F9F9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
);

export const CheckSvgIcon: FC = () => (
    <Svg width="42" height="42" viewBox="0 0 42 42" fill="none">
        <G id="check">
            <Path id="Vector" d="M34.6756 10.7441L15.8722 29.5476L7.3252 21.0006" stroke="#F9F9F9" stroke-width="3.4188" stroke-linecap="round" stroke-linejoin="round" />
        </G>
    </Svg>
);

export const CrossSvgIcon: FC = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M16 8L8 16M8.00001 8L16 16" stroke="#F9F9F9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
)
