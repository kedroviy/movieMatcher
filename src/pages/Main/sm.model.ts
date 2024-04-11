export type FilterOption = { id: number; name: string; label: string; };

export interface SMFormItem<T> {
    id: T;
    disabled?: boolean;
    label: string;
    children?: SMFormItem<T>[];
}

export type Genre = SMFormItem<number>;
export type Country = SMFormItem<number | string>;
export type Year = SMFormItem<number | string>;

export interface ISMFormData {
    excludeGenre: Genre[];
    genres?: Genre[];
    name: string;
    selectedCountries: Country[];
    selectedGenres: Genre[];
    selectedYears: Year[];
}

export type Option = {
    id: string | number;
    label: string;
    children?: Option[];
    disabled?: boolean;
};

export type Action<T> =
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_SELECTED_COUNTRIES'; payload: T[] }
    | { type: 'SET_SELECTED_GENRES'; payload: T[] }
    | { type: 'SET_SELECTED_YEARS'; payload: T[] }
    | { type: 'SET_EXCLUDE_GENRE'; payload: T[] }

export type SelectMovieType<T> = {
    name: string;
    selectedCountries: T[];
    selectedGenres: T[];
    selectedYears: T[];
    excludeGenre: T[];
    genres?: T[] | undefined;
};

export const initialState: SelectMovieType<FilterOption> = {
    name: '',
    selectedCountries: [],
    selectedGenres: [],
    selectedYears: [],
    excludeGenre: [],
    genres: [],
};

export function reducer<T>(state: SelectMovieType<T>, action: Action<T>): SelectMovieType<T> {
    let newState = { ...state };

    switch (action.type) {
        case 'SET_NAME':
            return { ...state, name: action.payload };
        case 'SET_SELECTED_COUNTRIES':
            return { ...state, selectedCountries: action.payload };
        case 'SET_SELECTED_GENRES':
            newState = {
                ...newState,
                selectedGenres: action.payload,
            };
            break;
        case 'SET_SELECTED_YEARS':
            return { ...state, selectedYears: action.payload };
        case 'SET_EXCLUDE_GENRE':
            newState = {
                ...newState,
                excludeGenre: action.payload,
            };
            break;
        default:
            return state;
    }

    // const allGenres = newState.selectedGenres.concat(newState.excludeGenre);
    // newState.genres = newState.genres.map((genre: any) => ({
    //     ...genre,
    //     disabled: allGenres.some((selectedOrExcluded: any) => selectedOrExcluded.id === genre.id),
    // }));

    return newState;
};