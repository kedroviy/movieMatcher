export interface Rating {
    kp: number;
    imdb: number;
    filmCritics: number;
    russianFilmCritics: number;
    await: number | null;
}

export interface Votes {
    kp: number;
    imdb: number;
    filmCritics: number;
    russianFilmCritics: number;
    await: number;
}

export interface Backdrop {
    url: string;
    previewUrl: string;
}

export interface Poster {
    url: string;
    previewUrl: string;
}

export interface Genre {
    name: string;
}

export interface Country {
    name: string;
}

export interface Name {
    name: string;
    language?: string;
    type?: string | null;
}

export interface Logo {
    url: string;
}

export interface Movie {
    status: string | null;
    rating: Rating;
    votes: Votes;
    backdrop: Backdrop;
    movieLength: number;
    id: number;
    type: string;
    name: string;
    description: string;
    year: number;
    poster: Poster;
    genres: Genre[];
    countries: Country[];
    typeNumber: number;
    alternativeName: string;
    enName: string | null;
    names: Name[];
    shortDescription: string;
    ageRating: number;
    ratingMpaa: string | null;
    ticketsOnSale: boolean;
    logo: Logo;
    top10: number | null;
    top250: number;
    isSeries: boolean;
    seriesLength: number | null;
    totalSeriesLength: number | null;
}

export interface SMApiResponse {
    docs: Movie[];
    total: number;
    limit: number;
    page: number;
    pages: number;
}

export type MoviesSavedType = {
    id: string,
    label: string,
    link: string,
    movies: Movie[]
}