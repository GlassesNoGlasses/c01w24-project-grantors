export default interface DropDownFilterProps {
    options: string[];
    identity: string;
    selectCallback?: (option: string) => void;
};