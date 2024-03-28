export default interface DropDownFilterProps {
    options: string[];
    identity: string;
    selected?: string;
    selectCallback?: (option: string) => void;
};