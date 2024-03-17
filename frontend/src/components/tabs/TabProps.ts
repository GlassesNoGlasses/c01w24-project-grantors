
export interface TabItem {
    label: String,
    callback: () => void,
}

export interface TabProps {
    items: TabItem[],
}

