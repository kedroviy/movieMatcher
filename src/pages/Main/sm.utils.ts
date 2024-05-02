import { Movie } from "features";
import { Option } from "./sm.model";
import { BASE_KP_URL } from "shared";

const generateYearOptionsWithNestedYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1890;
    const options: Option[] = [];

    for (let year = startYear; year <= currentYear; year += 10) {
        const decade = {
            id: `decade-${year}`,
            label: `${year}`,
            children: Array.from({ length: 10 }, (_, i) => {
                const childYear = year + i + 1;
                return childYear <= currentYear ? { id: childYear, label: String(childYear) } : null;
            }).filter(option => option !== null) as Option[],
        };

        options.push(decade);
    }

    return options;
};

export const generateKpUrl = (movie: Movie): string =>
    `${BASE_KP_URL}${movie.isSeries ? '/series/' : '/film/'}${movie.id}`;

export const yearOptions = generateYearOptionsWithNestedYears();