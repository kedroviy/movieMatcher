import { FILTERS_DATA } from "pages/Main/constants";
import { FilterOption, initialState, reducer } from "pages/Main/sm.model";
import { SMMultiSelectInput } from "pages/Main/ui/sm-multi-select-input";
import { FC, useReducer } from "react";
import { Modal, View, StyleSheet, Dimensions, ScrollView, Text, Pressable, TouchableOpacity } from "react-native";
import { DeleteSvgIcon, SimpleButton } from "shared";
import { Color } from "styles/colors";

type MatchFilterModalType = {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    onFiltersChange: (filters: any) => void;
}

const { width, height } = Dimensions.get('window')

export const MatchFilterModal: FC<MatchFilterModalType> = ({ modalVisible, setModalVisible, onFiltersChange }) => {
    const [state, SMdispatch] = useReducer(reducer<FilterOption>, initialState);

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

    const applyFilters = () => {
        onFiltersChange(state);
        setModalVisible(false);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >

            <View style={styles.container}>
                <View style={{
                    width: width - 32,
                    alignItems: 'flex-start',
                    marginBottom: 12,
                }}>
                    <Text style={styles.textStyle}>Filters</Text>
                </View>
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
                        <View style={{
                            width: width - 32,
                            alignItems: 'flex-start',
                            marginVertical: 12,
                        }}>
                            <Text style={styles.textStyle}>Other options</Text>
                            <View style={{
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
                                <Text style={[
                                    styles.textStyle,
                                    {
                                        fontSize: 14,
                                        fontWeight: '400'
                                    }
                                ]}
                                >
                                    Delete Room
                                </Text>
                                <TouchableOpacity style={{

                                }}
                                >
                                    <DeleteSvgIcon />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <SimpleButton
                    title={"Apply and close"}
                    color={Color.BUTTON_RED}
                    titleColor={Color.WHITE}
                    buttonWidth={width - 32}
                    onHandlePress={() => applyFilters()} />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
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
    scrollView: {

    },
});