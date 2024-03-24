export interface DropDownFilterProps {
    label: string,
    options: string[],
    setFilter: (search: string) => void,
    className?: string,
};