import { yearOptions } from "./sm.utils";

export const FILTERS_DATA = {
    country: {
        title: 'Выбор страны',
        placeholder: 'Выберите страну',
        options: [
            { id: 1, label: 'Беларусь' },
            { id: 2, label: 'СССР' },
            { id: 3, label: 'США' },
            { id: 4, label: 'Казахстан' },
            { id: 5, label: 'Франция' },
            { id: 6, label: 'Корея Южная' },
            { id: 7, label: 'Великобритания' },
            { id: 8, label: 'Япония' },
            { id: 9, label: 'Италия' },
            { id: 10, label: 'Испания' },
            { id: 11, label: 'Германия' },
            { id: 12, label: 'Турция' },
            { id: 13, label: 'Швеция' },
            { id: 14, label: 'Дания' },
            { id: 15, label: 'Норвегия' },
            { id: 16, label: 'Гонконг' },
            { id: 17, label: 'Австралия' },
            { id: 18, label: 'Бельгия' },
            { id: 19, label: 'Нидерланды' },
            { id: 20, label: 'Греция' },
            { id: 21, label: 'Австрия' },
            { id: 22, label: 'Канада' },
            { id: 23, label: 'Россия' },
            { id: 24, label: 'Корея Северная' },
        ],
    },
    year: {
        title: 'Выбор года',
        placeholder: 'Выберите год',
        options: yearOptions,
    },
    genre: {
        title: 'Выбор жанра',
        placeholder: 'Выберите жанр',
        options: [
            { id: 1, label: 'аниме' },
            { id: 2, label: 'биография' },
            { id: 3, label: 'боевик' },
            { id: 4, label: 'вестерн' },
            { id: 5, label: 'военный' },
            { id: 6, label: 'детектив' },
            { id: 7, label: 'детский' },
            { id: 8, label: 'для взрослых' },
            { id: 9, label: 'документальный' },
            { id: 10, label: 'драма' },
            { id: 11, label: 'игра' },
            { id: 12, label: 'история' },
            { id: 13, label: 'комедия' },
            { id: 14, label: 'концерт' },
            { id: 15, label: 'короткометражка' },
            { id: 16, label: 'криминал' },
            { id: 17, label: 'мелодрама' },
            { id: 18, label: 'музыка' },
            { id: 19, label: 'мультфильм' },
            { id: 20, label: 'мюзикл' },
            { id: 21, label: 'новости' },
            { id: 22, label: 'приключения' },
            { id: 23, label: 'реальное ТВ' },
            { id: 24, label: 'семейный' },
            { id: 25, label: 'спорт' },
            { id: 26, label: 'ток-шоу' },
            { id: 27, label: 'триллер' },
            { id: 28, label: 'ужасы' },
            { id: 29, label: 'фантастика' },
            { id: 30, label: 'фильм-нуар' },
            { id: 31, label: 'фэнтези' },
            { id: 32, label: 'церемония' },
        ],
    },
};