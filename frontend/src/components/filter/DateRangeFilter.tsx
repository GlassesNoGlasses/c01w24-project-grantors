import { useEffect, useState } from "react";
import { DateRangeFilterProps } from "./DateRangeFilterProps";

const DateRangeFilter = ({label, rangeStartLabel, 
        rangeEndLabel, setFilter, className}: DateRangeFilterProps) => {
    const [ rangeStart, setRangeStart ] = useState<Date | null>(null);
    const [ rangeEnd, setRangeEnd ] = useState<Date | null>(null);

    useEffect(() => {
        setFilter([rangeStart, rangeEnd]);

    }, [rangeStart, rangeEnd]);

    return (
        <div className={className}>
            <p className="text-base">{label}</p>
            <div className="flex flex-row gap-4">
                <div>
                    <p className="text-sm">{rangeStartLabel}</p>
                    <input type="date" className="border border-black text-black bg-white rounded-lg text-sm p-1 px-2"
                        value={rangeStart?.toISOString().split('T')[0] as string ?? ""}
                        onChange={(event) => setRangeStart(event.target.valueAsDate)} />
                </div>
                <div>
                    <p className="text-sm">{rangeEndLabel}</p>
                    <input type="date" className="border border-black text-black bg-white rounded-lg text-sm p-1 px-2"
                        value={rangeEnd?.toISOString().split('T')[0] as string ?? ""}
                        onChange={(event) => setRangeEnd(event.target.valueAsDate)} />
                </div>
            </div>
        </div>
    );
};

export default DateRangeFilter;