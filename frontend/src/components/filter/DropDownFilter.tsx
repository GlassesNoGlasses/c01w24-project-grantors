import { useEffect, useState } from "react";
import { DropDownFilterProps } from "./DropDownFilterProps";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

function DropDownFilter({label, options, setFilter }: DropDownFilterProps ) {
    const [isOpen, setIsOpen] = useState(false); // State to manage dropdown open/close
    const [selectedItem, setSelectedItem] = useState('Status'); // State to hold the selected item

    // Function to handle option selection
    const handleSelect = (option: string) => {
        setSelectedItem(option);
        setIsOpen(false);
    };

    useEffect(() => {
        setFilter(selectedItem);
    }, [selectedItem]);

    return (
        <div className="dropdown flex flex-col items-start">    
            <span className="text-base">{label}</span>
            <div className="flex flex-col items-center">
                <button className="dropdown-button flex flex-row gap-2 border-2 border-magnify-blue p-2 rounded-lg
                 bg-white hover:bg-magnify-blue transition ease-in-out duration-200" onClick={() => setIsOpen(!isOpen)}>
                    {selectedItem}
                    <ChevronDownIcon className="h-5"/>
                </button>
                {isOpen && (
                    <ul className="dropdown-content rounded bg-magnify-blue text-white">
                        {options.map(option => (
                            <li key={option} className="p-2 hover:bg-magnify-grey" onClick={() => handleSelect(option)}>
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DropDownFilter;