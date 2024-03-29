import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

export const menuItems = [
    {
        id: 0,
        iconComponent:
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path id="Vector" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <Path id="Vector_2" d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </Svg>,
        name: 'Настройка аккаунта',
        onHandlePress: () => console.log('1'),
    },
    {
        id: 1,
        iconComponent:
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <Path d="M13.9999 8.52667C13.8951 9.66147 13.4692 10.7429 12.7721 11.6445C12.075 12.5461 11.1356 13.2305 10.0637 13.6177C8.99188 14.0049 7.83192 14.0787 6.7196 13.8307C5.60728 13.5827 4.5886 13.023 3.78275 12.2172C2.97691 11.4113 2.41723 10.3927 2.16921 9.28033C1.92118 8.16801 1.99508 7.00806 2.38224 5.9362C2.7694 4.86434 3.45382 3.92491 4.35541 3.22784C5.257 2.53076 6.33847 2.10487 7.47327 2C6.80888 2.89884 6.48917 4.0063 6.57229 5.12094C6.65541 6.23559 7.13584 7.28337 7.9262 8.07373C8.71656 8.86409 9.76435 9.34452 10.879 9.42765C11.9936 9.51077 13.1011 9.19106 13.9999 8.52667Z" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
            </Svg>,
        name: 'Тема',
        onHandlePress: () => console.log('1'),
    },
    {
        id: 2,
        iconComponent:
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <G clip-path="url(#clip0_1064_7395)">
                    <Path d="M7.99967 14.6663C11.6816 14.6663 14.6663 11.6816 14.6663 7.99967C14.6663 4.31778 11.6816 1.33301 7.99967 1.33301C4.31778 1.33301 1.33301 4.31778 1.33301 7.99967C1.33301 11.6816 4.31778 14.6663 7.99967 14.6663Z" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                    <Path d="M1.33301 8H14.6663" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                    <Path d="M7.99967 1.33301C9.66719 3.15858 10.6148 5.5277 10.6663 7.99967C10.6148 10.4717 9.66719 12.8408 7.99967 14.6663C6.33215 12.8408 5.38451 10.4717 5.33301 7.99967C5.38451 5.5277 6.33215 3.15858 7.99967 1.33301Z" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                </G>
                <Defs>
                    <ClipPath id="clip0_1064_7395">
                        <Rect width="16" height="16" fill="white" />
                    </ClipPath>
                </Defs>
            </Svg>,
        name: 'Язык',
        onHandlePress: () => console.log('1'),
    },
    {
        id: 3,
        iconComponent:
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <G clip-path="url(#clip0_1104_7312)">
                    <Path d="M7.99967 14.6663C11.6816 14.6663 14.6663 11.6816 14.6663 7.99967C14.6663 4.31778 11.6816 1.33301 7.99967 1.33301C4.31778 1.33301 1.33301 4.31778 1.33301 7.99967C1.33301 11.6816 4.31778 14.6663 7.99967 14.6663Z" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                    <Path d="M8 5.33301V7.99967" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                    <Path d="M8 10.667H8.00667" stroke="#F9F9F9" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                </G>
                <Defs>
                    <ClipPath id="clip0_1104_7312">
                        <Rect width="16" height="16" fill="white" />
                    </ClipPath>
                </Defs>
            </Svg>,
        name: 'О приложении',
        onHandlePress: () => console.log('1'),
    }
]