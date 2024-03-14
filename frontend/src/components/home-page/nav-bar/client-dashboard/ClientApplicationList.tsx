import { useEffect, useState } from "react";
import { useUserContext } from "../../../contexts/userContext";
import { Application, ApplicationStatus } from "../../../interfaces/Application";
import { mockApplications } from "../admin-dashboard/mockApplications";
import { Column } from "../../../table/TableProps";
import Table from "../../../table/Table";
import { SERVER_PORT } from "../../../../constants/ServerConstants";

const ClientApplicationList = ({}) => {
    const { user, setUser } = useUserContext();
    const [ applications, setApplications ] = useState<Application[]>(mockApplications);

    const itemsPerPageOptions: number[] = [5,10,20,50,100];
    const columns: Column<Application>[] = [
        {
            key: "grantTitle",
            title: "Grant Titlte",
            format: (application: Application) => application.grantTitle,
            sort: (app1: Application, app2: Application) => app1.grantTitle < app2.grantTitle ? -1 : 1,
        },
        {
            key: "status",
            title: "Status",
            format: (application: Application) => application.status,
            sort: (app1: Application, app2: Application) => {
                if (app1.status === app2.status) return 0;
                if (app1.status === ApplicationStatus.inProgress) return 1;
                return -1;
            },
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
            }
        }

        fetchApplications();
    }, [user]);

    return (
        <div className="flex flex-col h-full items-start justify-start px-5 bg-grantor-green">
            <span className="text-2xl pl-2">Applications</span>
            <Table items={applications}
                   columns={columns}
                   itemsPerPageOptions={itemsPerPageOptions}
                   defaultIPP={10}
                   defaultSort={columns[1]}
            />
        </div>
    )
};

export default ClientApplicationList;