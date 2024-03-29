import { useEffect, useState } from "react";
import { DropDownFilterProps } from "./DropDownFilterProps";
import DropDown from "../displays/DropDown/DropDown";

function DropDownFilter({label, options, identity, setFilter, className}: DropDownFilterProps ) {
    const [selectedItem, setSelectedItem] = useState(identity);

    useEffect(() => {
        setFilter(selectedItem);
    }, [selectedItem]);

    return (
        <div className={`dropdown flex flex-col items-start ${className}`}>    
            <label className="text-base">{label}</label>
            <DropDown options={options} identity={identity} selectCallback={setSelectedItem} />
        </div>
    );
};

export default DropDownFilter;