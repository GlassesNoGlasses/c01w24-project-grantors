import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import DropDownProps from "./DropDownProps";

const DropDown = ({ options, identity, selected, selectCallback }: DropDownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(identity);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selected) {
            setSelectedItem(selected);
        }
    }, [selected]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false); // Close the dropdown if click is outside
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (option: string) => {
        setSelectedItem(option);
        setIsOpen(false);
        selectCallback && selectCallback(option);
    };

    const handleIdentityClick = () => {
        setSelectedItem(identity);
        setIsOpen(false);
        selectCallback && selectCallback("");
    }

    return (
        <div className="relative">
            <div className="flex flex-col relative w-fit" ref={dropdownRef}>
                <button type='button' className="dropdown-button flex flex-row gap-2 border-2 border-magnify-blue p-2 rounded-lg
                    bg-white text-black hover:bg-gray-400 transition ease-in-out duration-200 whitespace-nowrap" onClick={() => setIsOpen(!isOpen)}>
                    {selectedItem}
                    <ChevronDownIcon className="h-5"/>
                </button>
                {isOpen && (
                    <ul className="dropdown-content rounded bg-magnify-grey text-white absolute top-full">
                        <li className="p-2 hover:bg-gray-400" onClick={handleIdentityClick}>
                            {identity}
                        </li>
                        {options.map(option => (
                            <li key={option} className="p-2 hover:bg-gray-400" onClick={() => handleSelect(option)}>
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DropDown;