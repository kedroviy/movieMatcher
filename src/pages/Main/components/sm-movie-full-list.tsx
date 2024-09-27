import { FC, useEffect, useState } from "react"
import { Dimensions, FlatList, Pressable, StyleSheet, View } from "react-native"
import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "app/constants";
import { Color } from "styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Movie, MoviesSavedType } from "features/selection-movies/selection-movies.model";
import { MovieCardItemProps, SMCard } from "../ui/sm-card";
import { Loader, SimpleButton } from "shared";
import { MovieLoader } from "shared/ui/movie-loader";

type SMMovieFullListType = {
    route: RouteProp<RootStackParamList, 'SMMovieFullList'>;
};

const { width } = Dimensions.get('window');

export const SMMovieFullList: FC<SMMovieFullListType> = ({ route }) => {
    const { headerText } = route.params;
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const [moviesList, setMoviesList] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMoviesList = async () => {
            const listString = await AsyncStorage.getItem('@mymovies');
            if (listString) {
                const listObj: { [key: string]: MoviesSavedType } = JSON.parse(listString);
                const matchedItem = Object.values(listObj).find(item => item.label === headerText);
                if (matchedItem && matchedItem.movies) {
                    setMoviesList(matchedItem.movies);
                }
            }
        };
        fetchMoviesList();
    }, [headerText]);

    const onCardPress = (movie: Movie) => {
        navigation.navigate('SMMovieDetails', { movie });
    };

    const renderItem = ({ item }: { item: Movie }) => (
        <Pressable style={styles.contentContainer} onPress={() => onCardPress(item)}>
            <SMCard movie={item} />
        </Pressable>
    );

    const onHandleDelete = async () => {
        const listString = await AsyncStorage.getItem('@mymovies');
        if (listString) {
            const listObj: { [key: string]: MoviesSavedType } = JSON.parse(listString);
            delete listObj[headerText];
            await AsyncStorage.setItem('@mymovies', JSON.stringify(listObj));
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            {moviesList.length ?
                <>
                    <FlatList
                        data={moviesList}
                        renderItem={renderItem}
                        keyExtractor={(item: any) => item.id.toString()}

                        initialNumToRender={4}
                        getItemLayout={(data, index) => (
                            { length: 255, offset: 255 * index, index }
                        )}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false} />
                    <SimpleButton
                        title='Удалить список'
                        color={Color.BUTTON_RED}
                        titleColor={Color.WHITE}
                        buttonWidth={width - 32}
                        onHandlePress={onHandleDelete} />
                </>
                :
                <MovieLoader />
            }
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
    contentContainer: {
        height: 205,
        marginVertical: 16,
        backgroundColor: Color.GRAY_BROWN,
        borderRadius: 10,
    }
});