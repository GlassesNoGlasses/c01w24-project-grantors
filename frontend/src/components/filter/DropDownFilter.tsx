import { useEffect, useState } from "react";
import { DropDownFilterProps } from "./DropDownFilterProps";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import DropDown from "../displays/DropDown/DropDown";

function DropDownFilter({label, options, identity, setFilter, className}: DropDownFilterProps ) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(identity);

    const handleSelect = (option: string) => {
        setSelectedItem(option);
        setIsOpen(false);
    };

    const dropDownList = [identity, ...options];

    useEffect(() => {
        setFilter(selectedItem);
    }, [selectedItem]);

    return (
        <div className={`dropdown flex flex-col items-start ${className}`}>    
            <span className="text-base">{label}</span>
            <DropDown options={options} identity={identity} selectCallback={setSelectedItem} />
        </div>
    );
};

export default DropDownFilter;