import { FC, useReducer, useState } from "react"
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native"
import { useTranslation } from "react-i18next";

import { AppRoutes } from "app/constants";
import { AppConstants, SimpleButton, SimpleInput } from "shared";
import { Color } from "styles/colors";
import { SMMultiSelectInput } from "../ui/sm-multi-select-input";
import { FILTERS_DATA } from "../constants";
import { reducer, FilterOption, initialState, ISMFormData, SelectMovieType, Genre, Country, Year } from "../sm.model";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/configure-store";
import { loadMovies } from "redux/moviesSlice";

const windowHeight = Dimensions.get('window').height;

export const SMCreateMovieListFilter: FC = () => {
    const [state, SMdispatch] = useReducer(reducer<FilterOption>, initialState);
    const dispatch: AppDispatch = useDispatch();
    const { t } = useTranslation();
    const { data, loading } = useSelector((state: any) => state.moviesSlice);
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const [isFormValidInput, setIsFormValidInput] = useState<boolean>(false);

    const handleValidationInput = (isValid: boolean) => {
        setIsFormValidInput(isValid);
    };

    const handleSubmit = () => {
        const formData = transformToISMFormData(state);
        dispatch(loadMovies(formData));
        if (data) {
            navigation.navigate(
                AppRoutes.SELF_SELECT_NAVIGATOR, {
                screen: AppRoutes.SM_SELECTION_MOVIE,
            })
        }
        console.log('Form data:', state);
    };


    function transformToISMFormData(state: SelectMovieType<FilterOption>): ISMFormData {
        const transformedState: ISMFormData = {
            name: state.name,
            excludeGenre: state.excludeGenre.map(genre => ({ ...genre, type: 'genre' })),
            genres: state.genres?.map(genre => ({ ...genre, type: 'genre' })),
            selectedCountries: state.selectedCountries as Country[],
            selectedGenres: state.selectedGenres.map(genre => ({ ...genre, type: 'genre' })),
            selectedYears: state.selectedYears as Year[],
        };

        return transformedState;
    }


    const handleNameChange = (name: string) => {
        SMdispatch({ type: 'SET_NAME', payload: name });
    };

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
                    height: windowHeight / 1.3,
                }}>
                    <SimpleInput
                        label={t('selection_movie.create_list_component.list_name')}
                        onValidationChange={handleValidationInput}
                        value={state.name}
                        onChangeText={handleNameChange}
                        placeholder={t('selection_movie.create_list_component.list_name')}
                        textError={t('acc_settings.changeName.textError')}
                    />

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
                title={t('selection_movie.create_list_component.start_select')}
                onHandlePress={handleSubmit}
            />
            {loading ? (
                <View style={{ width: '100%', height: windowHeight, backgroundColor: Color.BLACK, opacity: 0.5 }}>
                    <ActivityIndicator />
                </View>
            ) : null}
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

    }
});