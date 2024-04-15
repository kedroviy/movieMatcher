import { FC, useEffect, useReducer, useState } from "react"
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native"
import { useTranslation } from "react-i18next";
import { format } from 'date-fns';

import { AppRoutes } from "app/constants";
import { AlertCircleSvgIcon, Loader, SimpleButton, SimpleNotification } from "shared";
import { Color } from "styles/colors";
import { SMMultiSelectInput } from "../ui/sm-multi-select-input";
import { FILTERS_DATA } from "../constants";
import { reducer, FilterOption, initialState, ISMFormData, SelectMovieType, Country, Year } from "../sm.model";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/configure-store";
import { clearError, clearResponse, loadMovies } from "redux/moviesSlice";

const { width, height } = Dimensions.get('window');

export const SMCreateMovieListFilter: FC = () => {
    const [state, SMdispatch] = useReducer(reducer<FilterOption>, initialState);
    const dispatch: AppDispatch = useDispatch();
    const { t } = useTranslation();
    const { data, loading, error, currentPage } = useSelector((state: any) => state.moviesSlice);
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [isNotificationHide, setIsNotificationHide] = useState<boolean>(true);

    useEffect(() => {
        if (!loading && data.total > 0) {
            navigation.navigate(AppRoutes.SELF_SELECT_NAVIGATOR, {
                screen: AppRoutes.SM_SELECTION_MOVIE,
            });
        }

        if (error) {
            setIsNotificationHide(false)
        }

        navigation.setOptions({
            headerShown: isNotificationHide,
        });

    }, [loading, data, error, navigation, isNotificationHide]);

    const handleSubmit = async () => {
        await dispatch(clearResponse());
        const formData = transformToISMFormData(state);

        await dispatch(loadMovies({ formData, sessionLabel: formatDate(), page: 1 }));
    };

    function formatDate(): string {
        return format(new Date(), 'dd-MM-yyyy HH:mm');
    }

    const handleClearError = () => {
        dispatch(clearError());
        setIsNotificationHide(true);
    };

    function transformToISMFormData(state: SelectMovieType<FilterOption>): ISMFormData {
        const transformedState: ISMFormData = {
            excludeGenre: state.excludeGenre.map(genre => ({ ...genre, type: 'genre' })),
            genres: state.genres?.map(genre => ({ ...genre, type: 'genre' })),
            selectedCountries: state.selectedCountries as Country[],
            selectedGenres: state.selectedGenres.map(genre => ({ ...genre, type: 'genre' })),
            selectedYears: state.selectedYears as Year[],
        };

        return transformedState;
    }

    const handleCountrySelectionChange = (selectedCountries: any[]) => {
        SMdispatch({ type: 'SET_SELECTED_COUNTRIES', payload: selectedCountries });
    };

    const handleYearSelectionChange = (selectedYears: any[]) => {
        SMdispatch({ type: 'SET_SELECTED_YEARS', payload: selectedYears });
    };

    const handleGenreSelectionChange = (selectedGenres: any[]) => {
        SMdispatch({ type: 'SET_SELECTED_GENRES', payload: selectedGenres });
    };

    const handleExcludeGenreChange = (excludeGenre: any[]) => {
        SMdispatch({ type: 'SET_EXCLUDE_GENRE', payload: excludeGenre });
    };

    const genreOptionsWithDisabled = FILTERS_DATA.genre.options.map((genre) => ({
        ...genre,
        disabled: state.excludeGenre.some((excludedGenre) => excludedGenre.id === genre.id),
    }));


    const excludeGenreOptionsWithDisabled = FILTERS_DATA.genre.options.map((genre) => ({
        ...genre,
        disabled: state.selectedGenres.some((selectedGenre) => selectedGenre.id === genre.id),
    }));

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={{
                    height: height / 1.3,
                }}>
                    <SMMultiSelectInput
                        label='Страна'
                        options={FILTERS_DATA.country.options}
                        selectedOptions={state.selectedCountries}
                        onSelectionChange={handleCountrySelectionChange}
                        placeholder="Select countries"
                    />

                    <SMMultiSelectInput
                        label='Год'
                        options={FILTERS_DATA.year.options}
                        selectedOptions={state.selectedYears}
                        onSelectionChange={handleYearSelectionChange}
                        placeholder="Select countries"
                    />

                    <SMMultiSelectInput
                        label='Жанр'
                        options={genreOptionsWithDisabled}
                        selectedOptions={state.selectedGenres}
                        onSelectionChange={handleGenreSelectionChange}
                        placeholder={FILTERS_DATA.genre.placeholder}
                    />

                    <SMMultiSelectInput
                        label='Исключить жанр'
                        options={excludeGenreOptionsWithDisabled}
                        selectedOptions={state.excludeGenre}
                        onSelectionChange={handleExcludeGenreChange}
                        placeholder={FILTERS_DATA.genre.placeholder}
                    />
                </View>
            </ScrollView>
            <SimpleButton
                color={Color.BUTTON_RED}
                titleColor={Color.WHITE}
                buttonWidth={width - 32}
                title={t('selection_movie.create_list_component.start_select')}
                onHandlePress={handleSubmit}
            />
            {loading ? (
                <View style={styles.loader}>
                    <Loader />
                </View>
            ) : null}
            {!isNotificationHide ?
                <SimpleNotification
                    icon={<AlertCircleSvgIcon />}
                    label='Упс, что-то пошло не так'
                    description='По вашему запросу ничего не найдено'
                    buttonText='Назад'
                    buttonColor={Color.BUTTON_RED}
                    onHandlePress={handleClearError}
                />
                : null}
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
    scrollView: {

    },
    loader: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: height,
        backgroundColor: Color.BLACK,
        opacity: 0.5
    }
});