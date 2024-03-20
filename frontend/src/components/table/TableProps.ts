export interface Column<T> {
    title: string,
    format: (item: T) => string,
    sort: (item1: T, item2: T) => number, // Returns number < 0 if item1 < item2, > 0 if item1 > item2, 0 if equal
}

export interface TableProps<T> {
    items: T[],
    columns: Column<T>[],
    itemsPerPageOptions: number[],
    defaultIPP: number,
    defaultSort: Column<T>,
    onRowClick?: (rowItem: T) => void,
};