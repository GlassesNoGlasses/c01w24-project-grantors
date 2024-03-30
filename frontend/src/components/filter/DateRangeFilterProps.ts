export interface DateRangeFilterProps {
    label: string,
    rangeStartLabel: string,
    rangeEndLabel: string,
    setFilter: (dateRange: (Date | null)[]) => void,
    className?: string,
};