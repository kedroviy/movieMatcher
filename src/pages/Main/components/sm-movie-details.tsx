import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "app/constants";
import { FC, useEffect, useState } from "react"
import { Alert, Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { Color } from "styles/colors";
import { SMMovieChips } from "../ui/sm-movie-chips";
import { getRatingColor, roundDownToOneTenth } from "../utils";
import { useDispatch, useSelector } from "react-redux";

import { Actor } from "../sm.model";
import { loadMovieDetails } from "redux/moviesSlice";
import { AppDispatch } from "redux/configure-store";
import { MovieLoader, SimpleButton } from "shared";
import { useTranslation } from "react-i18next";
import { generateKpUrl } from "../sm.utils";

type SMMovieDetailsType = {
    route: RouteProp<RootStackParamList, 'SMMovieDetails'>;
};

const { width } = Dimensions.get('window');

export const SMMovieDetails: FC<SMMovieDetailsType> = ({ route }) => {
    const dispatch: AppDispatch = useDispatch();
    const { movieDetails, loading } = useSelector((state: any) => state.moviesSlice);
    const { t } = useTranslation();
    const { movie } = route.params;
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    useEffect(() => {

        dispatch(loadMovieDetails(movie.id));

    }, [dispatch, movie.id]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handlePress = async () => {
        const url = generateKpUrl(movie);
        try {
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert('Не удалось открыть URL: ' + url);
        }
    };

    const renderActorsInColumns = () => {
        const columns = [];
        const actors = movieDetails.persons.filter((person: Actor) => person.profession === "актеры");

        for (let i = 0; i < actors.length; i += 3) {
            const columnActors = actors.slice(i, i + 3);
            columns.push(
                <View key={`column-${i}`} style={styles.actorColumn}>
                    {columnActors.map((actor: Actor, index: number) => (
                        <View key={`actor-${actor.id}`} style={styles.actorItem}>
                            <Image source={{ uri: actor.photo }} style={styles.actorPhoto} />
                            <View style={{ paddingLeft: 10, }}>
                                <Text style={styles.actorName}>{actor.name}</Text>
                                <Text style={styles.actorRole}>{actor.description}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            );
        }

        return columns;
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <Image
                        source={
                            movie.poster ? { uri: movie.poster.previewUrl } : require('../../../../assets/defaultpicture.png')
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
                        backgroundColor: getRatingColor(movie.rating.kp),
                        borderRadius: 5,
                        right: 12,
                        top: 16,
                    }}>
                        <Text style={[
                            styles.text, {
                                fontSize: 14,
                            }]}>
                            {roundDownToOneTenth(movie.rating.kp)}
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
                    {movie.name}
                </Text>
                <View style={{ width: width - 32 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <SMMovieChips
                            label={movie.ageRating}
                            color={Color.LIGHT_RED}
                            labelColor={Color.WHITE}
                            type="age"
                        />
                        <SMMovieChips
                            label={movie.movieLength}
                            color={Color.LIGHT_RED}
                            labelColor={Color.WHITE}
                            type="time"
                        />
                        {movie.genres.map((genre: any, index) => (
                            <SMMovieChips
                                key={index}
                                label={genre.name}
                                color={Color.LIGHT_RED}
                                labelColor={Color.WHITE}

                            />
                        ))}
                        {movie.countries.map((countrie: any, index) => (
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
                        {movie.description}
                    </Text>
                    <TouchableOpacity onPress={toggleExpanded}>
                        <Text style={{ color: Color.GREY, fontSize: 16 }}>
                            {isExpanded ? 'Свернуть' : 'Развернуть'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.text, { fontSize: 20 }]}>Актёры</Text>
                {loading ? <MovieLoader /> :
                    <View style={styles.actorContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {renderActorsInColumns()}
                        </ScrollView>
                    </View>
                }
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