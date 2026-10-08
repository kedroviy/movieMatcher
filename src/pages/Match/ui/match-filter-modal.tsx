import { Slider } from '@miblanchard/react-native-slider';
import { FILTERS_DATA } from 'pages/Main/constants';
import { useKpGenresRu, prefetchKpGenres } from 'pages/Main/hooks/use-kp-genres-ru';
import { resolveFiltersLocale } from 'features/filters/filters.model';
import { FilterOption, ISMFormData, initialState, reducer } from 'pages/Main/sm.model';
import { mapFiltersPayloadToKpNames } from 'pages/Main/utils/kp-filter-mapping';
import { fromRoomFiltersPayload } from 'pages/Main/utils/from-room-filters-payload';
import { setOpenDropdownId } from 'pages/Main/ui/dropdown-open-store';
import { SMMultiSelectInput } from 'pages/Main/ui/sm-multi-select-input';
import { FC, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Modal, View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { DeleteSvgIcon, SimpleButton } from 'shared';
import { Color } from 'styles/colors';

type MatchFilterModalType = {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    onFiltersChange: (filters: ISMFormData) => void;
    initialFilters?: ISMFormData | null;
};

const { width, height: screenHeight } = Dimensions.get('window');
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 900;

export const MatchFilterModal: FC<MatchFilterModalType> = ({
    modalVisible,
    setModalVisible,
    onFiltersChange,
    initialFilters,
}) => {
    const { t, i18n } = useTranslation();
    const { genreOptions, countryOptions, loading: filtersLoading, localizeCountries } = useKpGenresRu();
    const [state, SMdispatch] = useReducer(reducer<FilterOption>, initialState);
    const [range, setRange] = useState<[number, number]>([0, 10]);
    const localizedCountries = useMemo(
        () => localizeCountries(state.selectedCountries),
        [localizeCountries, state.selectedCountries],
    );

    useEffect(() => {
        if (modalVisible) {
            prefetchKpGenres(resolveFiltersLocale(i18n.language));
            return;
        }
        setOpenDropdownId(null);
    }, [modalVisible, i18n.language]);

    useEffect(() => () => setOpenDropdownId(null), []);

    useEffect(() => {
        if (!modalVisible) {
            return;
        }
        const next = fromRoomFiltersPayload(initialFilters, {
            genres: genreOptions,
            countries: countryOptions,
            years: FILTERS_DATA.year.options,
        });
        SMdispatch({ type: 'HYDRATE_FILTERS', payload: next });
        setRange(next.selectedRating);
    }, [modalVisible, initialFilters, genreOptions, countryOptions]);

    const handleRangeChange = (values: number[] | number) => {
        if (!Array.isArray(values) || values.length !== 2) {
            return;
        }
        const nextRange: [number, number] = [values[0], values[1]];
        setRange(nextRange);
        SMdispatch({ type: 'SET_SELECTED_RATING', payload: nextRange });
    };

    const handleCountrySelectionChange = useCallback((selectedCountries: FilterOption[]) => {
        SMdispatch({ type: 'SET_SELECTED_COUNTRIES', payload: selectedCountries });
    }, []);

    const handleYearSelectionChange = useCallback((selectedYears: FilterOption[]) => {
        SMdispatch({ type: 'SET_SELECTED_YEARS', payload: selectedYears });
    }, []);

    const handleGenreSelectionChange = useCallback((selectedGenres: FilterOption[]) => {
        SMdispatch({ type: 'SET_SELECTED_GENRES', payload: selectedGenres });
    }, []);

    const handleExcludeGenreChange = useCallback((excludeGenre: FilterOption[]) => {
        SMdispatch({ type: 'SET_EXCLUDE_GENRE', payload: excludeGenre });
    }, []);

    const genreOptionsWithDisabled = useMemo(
        () =>
            genreOptions.map((genre) => ({
                ...genre,
                disabled: state.excludeGenre.some((excludedGenre) => excludedGenre.id === genre.id),
            })),
        [genreOptions, state.excludeGenre],
    );

    const excludeGenreOptionsWithDisabled = useMemo(
        () =>
            genreOptions.map((genre) => ({
                ...genre,
                disabled: state.selectedGenres.some((selectedGenre) => selectedGenre.id === genre.id),
            })),
        [genreOptions, state.selectedGenres],
    );

    const translateY = useSharedValue(screenHeight);
    const translateX = useSharedValue(0);
    const isClosing = useSharedValue(false);
    const closingRef = useRef(false);

    const requestClose = useCallback(() => {
        if (closingRef.current) {
            return;
        }
        closingRef.current = true;
        isClosing.value = true;
        setOpenDropdownId(null);
        setModalVisible(false);
    }, [isClosing, setModalVisible]);

    useEffect(() => {
        if (!modalVisible) {
            return;
        }
        closingRef.current = false;
        isClosing.value = false;
        translateX.value = 0;
        translateY.value = screenHeight;
        translateY.value = withTiming(0, { duration: 280 });
    }, [isClosing, modalVisible, translateX, translateY]);

    useEffect(() => {
        if (!modalVisible) {
            return;
        }
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            requestClose();
            return true;
        });
        return () => subscription.remove();
    }, [modalVisible, requestClose]);

    const pan = useMemo(
        () =>
            Gesture.Pan()
                .activeOffsetY(8)
                .failOffsetX([-24, 24])
                .onUpdate((event) => {
                    if (isClosing.value) {
                        return;
                    }
                    translateY.value = Math.max(0, event.translationY);
                })
                .onEnd((event) => {
                    if (isClosing.value) {
                        return;
                    }
                    const shouldClose = event.translationY > DISMISS_DISTANCE || event.velocityY > DISMISS_VELOCITY;
                    if (!shouldClose) {
                        translateY.value = withSpring(0, { damping: 20, stiffness: 220 });
                        return;
                    }
                    isClosing.value = true;
                    translateY.value = withTiming(screenHeight, { duration: 180 });
                    runOnJS(requestClose)();
                }),
        [isClosing, requestClose, translateY],
    );

    const backPan = useMemo(
        () =>
            Gesture.Pan()
                .activeOffsetX([-24, 24])
                .failOffsetY([-16, 16])
                .onUpdate((event) => {
                    if (isClosing.value) {
                        return;
                    }
                    translateX.value = event.translationX;
                })
                .onEnd((event) => {
                    if (isClosing.value) {
                        return;
                    }
                    const shouldClose = Math.abs(event.translationX) > DISMISS_DISTANCE || Math.abs(event.velocityX) > DISMISS_VELOCITY;
                    if (!shouldClose) {
                        translateX.value = withSpring(0, { damping: 20, stiffness: 220 });
                        return;
                    }
                    isClosing.value = true;
                    const direction = event.translationX < 0 ? -width : width;
                    translateX.value = withTiming(direction, { duration: 180 });
                    runOnJS(requestClose)();
                }),
        [isClosing, requestClose, translateX],
    );

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }));

    const applyFilters = () => {
        onFiltersChange(mapFiltersPayloadToKpNames(state));
        requestClose();
    };

    if (!modalVisible) {
        return null;
    }

    return (
        <Modal animationType="none" transparent visible onRequestClose={requestClose}>
            <GestureHandlerRootView style={styles.gestureRoot}>
                <Animated.View style={[styles.container, sheetStyle]}>
                    <GestureDetector gesture={pan}>
                        <View style={styles.sheetHeader}>
                            <View style={styles.handle} />
                            <Text style={styles.textStyle}>{t('match_movie.filters_settings.settings')}</Text>
                        </View>
                    </GestureDetector>
                <View style={styles.filtersScrollArea}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                        contentContainerStyle={styles.filtersContent}
                    >
                        <SMMultiSelectInput
                            label={t('match_movie.filters_settings.country')}
                            options={countryOptions}
                            selectedOptions={localizedCountries}
                            onSelectionChange={handleCountrySelectionChange}
                            placeholder={t('movie_filters.placeholder_country')}
                            loading={filtersLoading}
                            loadingLabel={t('movie_filters.loading_countries')}
                            dropdownId="country"
                        />

                        <SMMultiSelectInput
                            label={t('match_movie.filters_settings.year')}
                            options={FILTERS_DATA.year.options}
                            selectedOptions={state.selectedYears}
                            onSelectionChange={handleYearSelectionChange}
                            placeholder={t('movie_filters.placeholder_year')}
                            dropdownId="year"
                        />

                        <SMMultiSelectInput
                            label={t('match_movie.filters_settings.genre')}
                            options={genreOptionsWithDisabled}
                            selectedOptions={state.selectedGenres}
                            onSelectionChange={handleGenreSelectionChange}
                            placeholder={t('movie_filters.placeholder_genre')}
                            loading={filtersLoading}
                            loadingLabel={t('movie_filters.loading_genres')}
                            dropdownId="genre"
                        />

                        <SMMultiSelectInput
                            label={t('match_movie.filters_settings.exclude_genre')}
                            options={excludeGenreOptionsWithDisabled}
                            selectedOptions={state.excludeGenre}
                            onSelectionChange={handleExcludeGenreChange}
                            placeholder={t('movie_filters.placeholder_genre')}
                            loading={filtersLoading}
                            loadingLabel={t('movie_filters.loading_genres')}
                            dropdownId="excludeGenre"
                        />
                        <View style={styles.sliderContainer}>
                            <Text style={styles.sliderLabelText}>{t('prompts.rating')}</Text>
                            <View style={styles.sliderLabel}>
                                <Text style={styles.label}>{range[0]}</Text>
                                <Text style={styles.label}>{range[1]}</Text>
                            </View>
                            <Slider
                                value={range}
                                onValueChange={handleRangeChange}
                                minimumValue={0}
                                maximumValue={10}
                                step={1}
                                minimumTrackTintColor={Color.RED}
                                maximumTrackTintColor={Color.WHITE}
                                thumbTintColor={Color.BUTTON_RED}
                                trackStyle={styles.sliderTrack}
                                thumbStyle={styles.sliderThumb}
                            />
                        </View>

                        <View
                            style={{
                                width: width - 32,
                                alignItems: 'flex-start',
                                marginVertical: 12,
                            }}
                        >
                            <Text style={styles.textStyle}>{t('match_movie.filters_settings.other_options')}</Text>
                            <View
                                style={{
                                    marginTop: 12,
                                    width: width - 32,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderColor: Color.EXTRA_LIGHT_GRAY,
                                    borderWidth: 0.3,
                                    borderRadius: 5,
                                    paddingHorizontal: 8,
                                }}
                            >
                                <Text
                                    style={[
                                        styles.textStyle,
                                        {
                                            fontSize: 14,
                                            fontWeight: '400',
                                        },
                                    ]}
                                >
                                    {t('match_movie.filters_settings.leave_room')}
                                </Text>
                                <TouchableOpacity style={{}}>
                                    <DeleteSvgIcon />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <SimpleButton
                    title={t('prompts.apply_and_close')}
                    color={Color.BUTTON_RED}
                    titleColor={Color.WHITE}
                    buttonWidth={width - 32}
                    onHandlePress={() => applyFilters()}
                />
                    <GestureDetector gesture={backPan}>
                        <View style={styles.backEdge} />
                    </GestureDetector>
                </Animated.View>
            </GestureHandlerRootView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    gestureRoot: {
        flex: 1,
    },
    backEdge: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 48,
        zIndex: 20,
    },
    sheetHeader: {
        width: width - 32,
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    handle: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: Color.EXTRA_LIGHT_GRAY,
        marginBottom: 12,
    },
    container: {
        backgroundColor: Color.BACKGROUND_GREY,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 32,
    },
    modalView: {
        margin: 20,
        backgroundColor: Color.GRAY_BROWN,
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: width - 32,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: Color.BUTTON_RED,
    },
    textStyle: {
        color: Color.WHITE,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    sliderContainer: {},
    slider: {
        width: width - 40,
    },
    sliderLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderLabelText: {
        fontSize: 14,
        color: Color.WHITE,
        marginBottom: 8,
        fontFamily: 'Roboto',
        top: 0,
    },
    sliderTrack: {
        height: 2,
    },
    sliderThumb: {
        width: 20,
        height: 20,
    },
    label: {
        fontSize: 16,
        color: Color.WHITE,
    },
    range: {
        marginTop: 20,
    },
    rangeLabel: {
        fontSize: 16,
    },
    filtersScrollArea: {
        flex: 1,
        width: width - 32,
    },
    filtersContent: {
        paddingBottom: 16,
    },
});
