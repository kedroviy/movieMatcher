import { Option } from "./sm.model";

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

export const yearOptions = generateYearOptionsWithNestedYears();