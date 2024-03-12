import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../contexts/userContext';
import { AdminApplicationListProps } from './AdminApplicationListProps';
import { Application } from '../../../interfaces/Application';
import { SERVER_PORT } from '../../../../constants/ServerConstants';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { mockApplications } from './mockApplications';
import Table from '../../../table/Table';
import { Column } from '../../../table/TableProps';

const AdminApplicationList = ({}: AdminApplicationListProps) => {
    const { user, setUser } = useUserContext();
    const [ applications, setApplications ] = useState<Application[]>(mockApplications);
    const { organization } = useParams();
    const navigate = useNavigate();

    const itemsPerPageOptions: number[] = [5,10,20,50,100];
    const columns: Column<Application>[] = [
        {
            key: "grantTitle",
            title: "Grant Titlte",
            format: (application: Application) => application.grantTitle,
            sort: (app1: Application, app2: Application) => app1.grantTitle < app2.grantTitle ? -1 : 1,
        },
        {
            key: "userID",
            title: "Applicant",
            format: (application: Application) => String(application.userID),
            sort: (app1: Application, app2: Application) => app1.userID - app2.userID,
        },
        {
            key: "submissionDate",
            title: "Date",
            format: (application: Application) => {
                return application.submissionDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            },
            sort: (app1: Application, app2: Application) => Number(app1.submissionDate) - Number(app2.submissionDate),
        },
    ];

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

    return (
        <div className="flex flex-col h-full items-start justify-start px-5 bg-grantor-green">
            <span className="text-2xl pl-2">Applications</span>
            <Table items={applications}
                columns={columns}
                itemsPerPageOptions={itemsPerPageOptions}
                defaultIPP={10}
                defaultSort={columns[2]}
            />
        </div>
    )
};

export default AdminApplicationList;