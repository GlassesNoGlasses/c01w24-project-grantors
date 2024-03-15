import React, { useEffect, useState } from 'react';
import { Column, TableProps } from './TableProps';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

function Table<T>(
    {
        items,
        columns,
        itemsPerPageOptions,
        defaultIPP,
        defaultSort,
    }: TableProps<T>) {
    const [ pageItems, setPageItems ] = useState<T[]>(items.slice(0, defaultIPP));
    const [ currentPage, setCurrentPage ] = useState<number>(0);
    const [ itemsPerPage, setItemsPerPage ] = useState<number>(defaultIPP);
    const [ maxPage, setMaxPage ] = useState(Math.max(Math.ceil(items.length / itemsPerPage) - 1, 0));
    
    const [ sortColumn, setSortColumn ] = useState<Column<T>>(defaultSort);
    const [ sortAscending, setSortAscending ] = useState<boolean>(false);

    useEffect(() => {
        items.sort((item1: T, item2: T) => {
            const ascendingMult = sortAscending ? 1 : -1;
            return sortColumn.sort(item1, item2) * ascendingMult;
        });

        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        setPageItems(items.slice(startIndex, endIndex));

    }, [items, itemsPerPage, currentPage, sortColumn, sortAscending]);

    useEffect(() => {
        console.log()
        setMaxPage(Math.max(Math.ceil(items.length / itemsPerPage) - 1, 0));
        if (currentPage > maxPage) {
            setCurrentPage(maxPage)
        }
    }, [items, itemsPerPage]);

    const goToPage = (page: number) => {
        if (page > maxPage) {
            return setCurrentPage(maxPage);
        } else if (page < 0) {
            return setCurrentPage(0);
        }

        return setCurrentPage(page);
    };

    const getPageOptions = () => {
        let options = [];
        if (currentPage != 0) {
            options.push(currentPage - 1);
        }
        
        for (let i = currentPage; i < Math.min(currentPage  + 4, maxPage); i++) {
            options.push(i);
        }

        if (options.length < 5) {
            options.push(maxPage);
        }

        return options;
    };

    return (
        <div className="flex flex-col w-full items-start justify-start">
            <table className="w-full bg-slate-50 text-left rounded-lg">
                <thead className="border-collapse uppercase">
                    <tr>
                        {Array.from(columns).map((column) => (
                            <th onClick={() => {setSortColumn(column); setSortAscending(!sortAscending)}} className="border-b-4 border-slate-300 text-base rounded-md p-2" scope="col">
                                <div className="flex items-center gap-1 hover:bg-slate-300 hover:rounded-md" >
                                    <span>{column.title}</span>
                                    <ChevronDownIcon className={`h-8 ${sortColumn === column ? "bg-slate-300 rounded-md" : "" }`} />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y-4">
                    {pageItems.map((item) => (
                        <tr className="hover:bg-slate-300">
                            {columns.map((column) => (
                                <td className="text-base px-2 py-1">{column.format(item)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="p-2">Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, items.length)} of {items.length}</div>
            <div className="flex flex-row justify-between w-full">
                <div className="bg-slate-50 rounded-md" aria-label="Table navigation">
                    <ul className="flex flex-row items-center text-sm">
                        <li>
                            <a href="#" onClick={() => goToPage(currentPage-1)} className="flex items-center justify-center px-3 h-8 hover:bg-slate-300 hover:rounded-md">Previous</a>
                        </li>
                        {Array.from(getPageOptions()).map((value) => (
                            <li>
                                <a href="#" onClick={() => goToPage(value)} className={`flex items-center justify-center px-3 h-8 hover:bg-slate-300 hover:rounded-md ${value === currentPage ? "bg-slate-300 rounded-md" : ''}`}>{value + 1}</a>
                            </li>
                        ))}
                        <li>
                            <a href="#" onClick={() => goToPage(currentPage+1)} className="flex items-center justify-center px-3 h-8 hover:bg-slate-300 hover:rounded-md">Next</a>
                        </li>
                    </ul>
                </div>
                <div className="bg-slate-50 rounded-md" aria-label="Items per page">
                    <ul className="flex flex-row items-center text-sm">
                        <li className="flex items-center justify-center px-3 h-8 hover:bg-slate-300 hover:rounded-md">
                            <span>Items per page</span>
                        </li>
                        {Array.from(itemsPerPageOptions).map((value) => (
                            <li className={`flex items-center justify-center px-3 h-8 hover:bg-slate-300 hover:rounded-md ${itemsPerPage === value ? "bg-slate-300 rounded-md" : ''}`}>
                                <a href="#" onClick={() => setItemsPerPage(value)}>{value}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Table;