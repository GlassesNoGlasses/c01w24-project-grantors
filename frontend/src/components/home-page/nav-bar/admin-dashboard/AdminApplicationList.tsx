import { useEffect, useState } from 'react';
import { useUserContext } from '../../../contexts/userContext';
import { AdminApplicationListProps } from './AdminApplicationListProps';
import { Application } from '../../../../interfaces/Application';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../../../table/Table';
import { Column } from '../../../table/TableProps';
import ApplicationsController from '../../../../controllers/ApplicationsController';

const AdminApplicationList = ({}: AdminApplicationListProps) => {
    const { user, setUser } = useUserContext();
    const [ applications, setApplications ] = useState<Application[]>([]);
    const { organization } = useParams();
    const navigate = useNavigate();

    const itemsPerPageOptions: number[] = [5,10,20,50,100];
    const columns: Column<Application>[] = [
        {
            title: "Grant Titlte",
            format: (application: Application) => application.grantTitle,
            sort: (app1: Application, app2: Application) => app1.grantTitle < app2.grantTitle ? -1 : 1,
        },
        {
            title: "Applicant",
            format: (application: Application) => String(application.applicantID),
            sort: (app1: Application, app2: Application) => app1.applicantID < app2.applicantID ? -1 : 1,
        },
        {
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

    const onApplicationRowClick = (application: Application) => {
        navigate(`/application/${application.id}/review`);
    }

    useEffect(() => {
        // Redirect user if they are not apart of this org
        if (user) {
            if (user.organization !== organization) {
                navigate('/')
            }

            ApplicationsController.fetchOrgApplications(user).then((applications: Application[] | undefined) => {
                if (applications) {
                    setApplications(applications.map((application: Application) => {
                        return application;
                    }));
                } else {
                    // TODO: Display error message / popup
                    console.error("Failed getting admin applications");
                }
            });
        }

    }, [user, navigate]);

    return (
        <div className="flex flex-col h-full items-start justify-start px-5 bg-grantor-green">
            <span className="text-2xl pl-2">{organization} Grant Applications</span>
            <Table<Application> items={applications.filter((app) => app.submitted)}
                   columns={columns}
                   itemsPerPageOptions={itemsPerPageOptions}
                   defaultIPP={10}
                   defaultSort={columns[2]}
                   onRowClick={onApplicationRowClick}
            />
        </div>
    );
};

export default AdminApplicationList;