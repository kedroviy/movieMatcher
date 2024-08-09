import { FC, Key, useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { Color } from "styles/colors";

import { useTranslation } from "react-i18next";
import { AppDispatch } from "redux/configure-store";
import { SMCard } from "pages/Main/ui/sm-card";
import { Movie } from "features";
import { RootStackParamList } from "app/constants";
import { SMMovieDetails } from "pages/Main";
import { Actor } from "pages/Main/sm.model";
import { generateKpUrl } from "pages/Main/sm.utils";
import { SMMovieChips } from "pages/Main/ui/sm-movie-chips";
import { getRatingColor, roundDownToOneTenth } from "pages/Main/utils";
import { loadMovieDetails } from "redux/moviesSlice";
import { SimpleButton } from "shared";

type MatchResultProps = {};

const { width } = Dimensions.get('window')

export const MatchResult: FC<MatchResultProps> = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { currentUserMatch, movies, loading } = useSelector((state: any) => state.matchSlice);
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);


    console.log('movies: ', movies.data.docs[0]);
    console.log(movies.data.docs[0].rating.kp);
    useEffect(() => {
        dispatch(loadMovieDetails(movies.data.docs[0].id));

    }, [dispatch, movies.data.docs[0].id]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handlePress = async () => {
        const url = generateKpUrl(movies.data.docs[0]);
        try {
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert('Не удалось открыть URL: ' + url);
        }
    };

    // const renderActorsInColumns = () => {
    //     const columns = [];
    //     const actors = movies.data.docs[0].persons.filter((person: Actor) => person.profession === "актеры");

    //     for (let i = 0; i < actors.length; i += 3) {
    //         const columnActors = actors.slice(i, i + 3);
    //         columns.push(
    //             <View key={`column-${i}`} style={styles.actorColumn}>
    //                 {columnActors.map((actor: Actor, index: number) => (
    //                     <View key={`actor-${actor.id}`} style={styles.actorItem}>
    //                         <Image source={{ uri: actor.photo }} style={styles.actorPhoto} />
    //                         <View style={{ paddingLeft: 10, }}>
    //                             <Text style={styles.actorName}>{actor.name}</Text>
    //                             <Text style={styles.actorRole}>{actor.description}</Text>
    //                         </View>
    //                     </View>
    //                 ))}
    //             </View>
    //         );
    //     }

    //     return columns;
    // };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <Image
                        source={
                            movies.data.docs[0].poster ? { uri: movies.data.docs[0].poster.previewUrl } : require('../../../../assets/defaultpicture.png')
                        }
                        style={{
                            width: width - 32,
                            height: 260,
                            resizeMode: 'cover',
                            borderRadius: 10,
                        }}
                    />
                    <View style={{
                        position: 'absolute',
                        width: 41,
                        height: 30,
                        paddingVertical: 2,
                        paddingHorizontal: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: getRatingColor(movies.data.docs[0].rating.kp),
                        borderRadius: 5,
                        right: 12,
                        top: 16,
                    }}>
                        <Text style={[
                            styles.text, {
                                fontSize: 14,
                            }]}>
                            {roundDownToOneTenth(movies.data.docs[0].rating.kp)}
                        </Text>
                    </View>
                </View>
                <Text style={[
                    styles.text, {
                        fontFamily: 'Roboto',
                        fontSize: 24,
                        fontWeight: '700',
                        lineHeight: 28.8,
                        paddingVertical: 24,
                    }]}>
                    {movies.data.docs[0].name}
                </Text>
                <View style={{ width: width - 32 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <SMMovieChips
                            label={movies.data.docs[0].ageRating}
                            color={Color.LIGHT_RED}
                            labelColor={Color.WHITE}
                            type="age"
                        />
                        <SMMovieChips
                            label={movies.data.docs[0].movieLength}
                            color={Color.LIGHT_RED}
                            labelColor={Color.WHITE}
                            type="time"
                        />
                        {movies.data.docs[0].genres.map((genre: any, index: Key | null | undefined) => (
                            <SMMovieChips
                                key={index}
                                label={genre.name}
                                color={Color.LIGHT_RED}
                                labelColor={Color.WHITE}

                            />
                        ))}
                        {movies.data.docs[0].countries.map((countrie: any, index: Key | null | undefined) => (
                            <SMMovieChips
                                key={index}
                                label={countrie.name}
                                color={Color.LIGHT_RED}
                                labelColor={Color.WHITE}

                            />
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.contentContainer}>
                    <Text
                        style={[styles.text, { fontSize: 16, marginBottom: 5 }]}
                        numberOfLines={isExpanded ? undefined : 4}
                        ellipsizeMode='tail'
                    >
                        {movies.data.docs[0].description}
                    </Text>
                    <TouchableOpacity onPress={toggleExpanded}>
                        <Text style={{ color: Color.GREY, fontSize: 16 }}>
                            {isExpanded ? 'Свернуть' : 'Развернуть'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* <Text style={[styles.text, { fontSize: 20 }]}>Актёры</Text>
                {loading ? <ActivityIndicator /> :
                    <View style={styles.actorContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {renderActorsInColumns()}
                        </ScrollView>
                    </View>
                } */}
            </ScrollView>
            <View>
                <SimpleButton
                    title={t('selection_movie.movie_details.watch')}
                    color={Color.BUTTON_RED}
                    titleColor={Color.WHITE}
                    buttonWidth={width - 32}
                    onHandlePress={handlePress}
                />
            </View>
        </View>
    );
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
        width: width - 32,
        marginVertical: 16,
        borderRadius: 10,
    },
    text: {
        color: Color.WHITE,
    },
    actorContainer: {
        width: width - 32,
        flex: 0.5,
        justifyContent: 'space-around',
        paddingTop: 16,
    },
    actorColumn: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    actorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginRight: 28,
    },
    actorItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    actorPhoto: {
        width: 70,
        height: 70,
        borderRadius: 5,
    },
    actorName: {
        color: Color.WHITE,
        fontSize: 16,
    },
    actorRole: {
        color: Color.WHITE,
        fontSize: 14,
    },
});