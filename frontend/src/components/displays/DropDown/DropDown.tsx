import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import DropDownProps from "./DropDownProps";

const DropDown = ({ options, identity, selectCallback }: DropDownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(identity);

    const dropDownList = [identity, ...options];

    const handleSelect = (option: string) => {
        setSelectedItem(option);
        setIsOpen(false);
        selectCallback && selectCallback(option);
    };
    

    return (
        <div className="flex flex-col items-center">
            <button className="dropdown-button flex flex-row gap-2 border-2 border-magnify-blue p-2 rounded-lg
                bg-white text-black hover:bg-gray-400 transition ease-in-out duration-200" onClick={() => setIsOpen(!isOpen)}>
                {selectedItem}
                <ChevronDownIcon className="h-5"/>
            </button>
            {isOpen && (
                <ul className="dropdown-content rounded bg-magnify-grey text-white absolute mt-11">
                    {dropDownList.map(option => (
                        <li key={option} className="p-2 hover:bg-gray-400" onClick={() => handleSelect(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropDown;