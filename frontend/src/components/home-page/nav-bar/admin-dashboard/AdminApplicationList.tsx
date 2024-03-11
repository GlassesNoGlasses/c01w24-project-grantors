import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../contexts/userContext';
import { AdminApplicationListProps } from './AdminApplicationListProps';
import { Application } from '../../../interfaces/Application';
import { SERVER_PORT } from '../../../../constants/ServerConstants';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { mockApplications } from './mockApplications';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const AdminApplicationList = ({}: AdminApplicationListProps) => {
    const { user, setUser } = useUserContext();
    const [ applications, setApplications ] = useState<Application[]>(mockApplications);
    const [ itemsPerPage, setItemsPerPage ] = useState(10);
    const [ pageItems, setPageItems ] = useState<Application[]>(applications.slice(0, itemsPerPage));
    const [ currentPage, setCurrentPage ] = useState(0);
    const [ maxPage, setMaxPage ] = useState(Math.ceil(applications.length / itemsPerPage) - 1);
    const [ sortColumn, setSortColumn ] = useState<string>("Date");
    const [ sortAscending, setSortAscending ] = useState(false);

    const { organization } = useParams();
    const navigate = useNavigate();

    const itemsPerPageOptions: number[] = [5,10,20,50,100];
    const columns: string[] = ["Grant Title", "Applicant", "Date"];

    useEffect(() => {
        // Redirect user if they are not apart of this org
        if ( user?.organization != organization ) {
            navigate('/')
        }

        const fetchApplications = async () => {
            if (!user?.authToken) {
                return; //setApplications([]);
            }
            const res = await fetch(`http://localhost:${SERVER_PORT}/getApplications`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user?.authToken}`
                },
                body: JSON.stringify({ organization: user.organization }),
              });

            if (res.ok) {
                await res.json().then((data) => {
                    //return setApplications(data.applications);
                });
            } else {
                // Bad response, logout the user and redirect
                console.log(res);
                setUser(null)
                navigate('/login')
            }
        }

        fetchApplications();
    }, [user, navigate]);

    useEffect(() => {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        applications.sort((app1: Application, app2: Application) => {
            const ascendingMult = sortAscending ? 1 : -1;
            if (sortColumn == "Date"){
                return (Number(app1.submissionDate) - Number(app2.submissionDate)) * ascendingMult;
            }
            return (app1.userID - app2.userID) * ascendingMult;
        });
        setPageItems(applications.slice(startIndex, endIndex));
    }, [itemsPerPage, currentPage, sortColumn, sortAscending])

    useEffect(() => {
        setMaxPage(Math.ceil(applications.length / itemsPerPage) - 1);
        if (currentPage > maxPage) {
            setCurrentPage(maxPage) 
        }
    }, [itemsPerPage, maxPage]);

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
        <div className="flex flex-col h-full items-start justify-start px-5 bg-grantor-green">
            <span className="text-2xl pl-2">Applications</span>
            <table className="w-full bg-slate-50 text-left rounded-lg">
                <thead className="border-collapse uppercase">
                    <tr>
                        {Array.from(columns).map((colName) => (
                             <th onClick={() => {setSortColumn(colName); setSortAscending(!sortAscending)}} className="border-b-4 border-slate-300 text-base rounded-md p-2" scope="col">
                                <div className="flex items-center gap-1 hover:bg-slate-300 hover:rounded-md" >
                                    <span>{colName}</span>
                                    <ChevronDownIcon className={`h-8 ${sortColumn === colName ? "bg-slate-300 rounded-md" : "" }`} />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y-4">
                    {pageItems.map((application) => (
                        <tr className="hover:bg-slate-300">
                            <td className="text-base px-2 py-1">{application.grantTitle}</td>
                            <td className="text-base px-2 py-1">{String(application.userID)}</td>
                            <td className="text-base px-2 py-1">{
                                application.submissionDate?.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                            </td>
                        </tr>
                    ))}
                </tbody> 
            </table>
            <div className="p-2">Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, applications.length)} of {applications.length}</div>
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
    )
};

export default AdminApplicationList;