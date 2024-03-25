export interface DropDownFilterProps {
    label: string,
    options: string[],
    identity: string, // option that resets the filter, and the initial value shown
    setFilter: (search: string) => void,
    className?: string,
};