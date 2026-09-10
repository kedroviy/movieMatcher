export interface SMFormItem<T> {
    id: T;
    disabled?: boolean;
    label: string;
    kpName?: string;
    children?: SMFormItem<T>[];
    name?: string;
}

export type FilterOption = SMFormItem<string | number>;
export type Option = FilterOption;
export type Genre = SMFormItem<string | number>;
export type Country = SMFormItem<string | number>;
export type Year = SMFormItem<string | number>;

export interface ISMFormData {
    excludeGenre: Genre[];
    genres?: Genre[];
    selectedCountries: Country[];
    selectedGenres: Genre[];
    selectedYears: Year[];
    selectedRating: [number, number];
}

export type RoomFiltersUpdatedEvent = {
    roomKey?: string;
    filters?: ISMFormData | null;
};

export type SelectMovieType<T> = {
    selectedCountries: T[];
    selectedGenres: T[];
    selectedYears: T[];
    excludeGenre: T[];
    genres?: T[] | undefined;
    selectedRating: [number, number];
};

export type Action<T> =
    | { type: 'SET_SELECTED_COUNTRIES'; payload: T[] }
    | { type: 'SET_SELECTED_GENRES'; payload: T[] }
    | { type: 'SET_SELECTED_YEARS'; payload: T[] }
    | { type: 'SET_EXCLUDE_GENRE'; payload: T[] }
    | { type: 'SET_SELECTED_RATING'; payload: [number, number] }
    | { type: 'HYDRATE_FILTERS'; payload: SelectMovieType<T> };

export const initialState: SelectMovieType<FilterOption> = {
    selectedCountries: [],
    selectedGenres: [],
    selectedYears: [],
    excludeGenre: [],
    genres: [],
    selectedRating: [0, 10],
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
    switch (action.type) {
        case 'SET_SELECTED_COUNTRIES':
            return { ...state, selectedCountries: action.payload };
        case 'SET_SELECTED_GENRES':
            return { ...state, selectedGenres: action.payload };
        case 'SET_SELECTED_YEARS':
            return { ...state, selectedYears: action.payload };
        case 'SET_EXCLUDE_GENRE':
            return { ...state, excludeGenre: action.payload };
        case 'SET_SELECTED_RATING':
            return { ...state, selectedRating: action.payload };
        case 'HYDRATE_FILTERS':
            return action.payload;
        default:
            return state;
    }
}
