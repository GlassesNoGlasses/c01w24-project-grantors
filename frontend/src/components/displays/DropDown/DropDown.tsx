import { ChevronDownIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
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

    const handleKeyDown = (event: React.KeyboardEvent, option: string) => {
        console.log(event.key);
        if (event.key === 'Enter') {
            handleSelect(option);
        } else if (event.key === 'Escape') {
            setIsOpen(false);
        }
    }


    return (
        <div className="relative">
            <div className="flex flex-col relative w-fit" ref={dropdownRef}>
                <button type='button' role="button" className="dropdown-button flex flex-row gap-2 border-2
                     border-magnify-blue p-2 rounded-lg bg-white text-black hover:bg-gray-400 transition
                     ease-in-out duration-200 whitespace-nowrap" onClick={() => setIsOpen(!isOpen)} aria-haspopup="true"
                     aria-expanded={isOpen} onKeyDown={(e) => handleKeyDown(e, selectedItem)}>
                    {selectedItem}
                    <ChevronDownIcon className="h-5"/>
                </button>
                {isOpen && (
                    <ul className="dropdown-content rounded bg-magnify-grey text-white absolute top-full"
                        role="menu">
                        <li className="p-2 hover:bg-gray-400" onClick={() => handleSelect(identity)} role="menuitem"
                            tabIndex={0} onKeyDown={(e) => handleKeyDown(e, identity)}>
                            {identity}
                        </li>
                        {options.map(option => (
                            <li key={option} className="p-2 hover:bg-gray-400" onClick={() => handleSelect(option)}
                                role="menuitem" tabIndex={0} onKeyDown={(e) => handleKeyDown(e, option)}>
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