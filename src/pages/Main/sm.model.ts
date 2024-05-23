export type FilterOption = { id: number; name?: string; label: string; };

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
    | { type: 'SET_SELECTED_COUNTRIES'; payload: T[] }
    | { type: 'SET_SELECTED_GENRES'; payload: T[] }
    | { type: 'SET_SELECTED_YEARS'; payload: T[] }
    | { type: 'SET_EXCLUDE_GENRE'; payload: T[] }

export type SelectMovieType<T> = {
    selectedCountries: T[];
    selectedGenres: T[];
    selectedYears: T[];
    excludeGenre: T[];
    genres?: T[] | undefined;
};

export const initialState: SelectMovieType<FilterOption> = {
    selectedCountries: [],
    selectedGenres: [],
    selectedYears: [],
    excludeGenre: [],
    genres: [],
};

export interface Actor {
    id: number;
    photo: string;
    name: string;
    enName: string;
    description: string;
    profession: string;
    enProfession: string;
}

export function reducer<T>(state: SelectMovieType<T>, action: Action<T>): SelectMovieType<T> {
    let newState = { ...state };

    switch (action.type) {
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

    return newState;
};