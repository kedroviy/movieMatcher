import { Movie } from 'features';
import { FilterOption } from './sm.model';
import { BASE_KP_URL } from 'shared';

const generateYearOptionsWithNestedYears = (): FilterOption[] => {
    const currentYear = new Date().getFullYear();
    const startYear = 1890;
    const options: FilterOption[] = [];

    for (let year = startYear; year <= currentYear; year += 10) {
        const children: FilterOption[] = [];
        const childYears: number[] = [];
        for (let index = 0; index < 10; index += 1) {
            const childYear = year + index;
            if (childYear > currentYear) {
                break;
            }
            childYears.push(childYear);
            children.push({
                id: childYear,
                label: String(childYear),
                kpName: String(childYear),
            });
        }
        if (!children.length) {
            continue;
        }
        const min = childYears[0];
        const max = childYears[childYears.length - 1];
        options.push({
            id: `decade-${year}`,
            label: String(year),
            kpName: min === max ? String(min) : `${min}-${max}`,
            children,
        });
    }

    return options.reverse();
};

export const generateKpUrl = (movie: Movie): string =>
    `${BASE_KP_URL}${movie.isSeries ? '/series/' : '/film/'}${movie.id}`;

export const yearOptions = generateYearOptionsWithNestedYears();
