import { useUserContext } from '../contexts/userContext';
import { useEffect, useState } from "react";
import { GrantStatsPageProps, TableValues } from "./GrantStatsPageProps";
import ApplicationsController from "../../controllers/ApplicationsController"
import GrantsController from "../../controllers/GrantsController"
import { Application, ApplicationStatus } from "../../interfaces/Application";
import { Chart } from "react-google-charts";
import {User} from '../../interfaces/User'
import {Grant} from '../../interfaces/Grant'

const GrantStatsPage = ({}: GrantStatsPageProps) => {
    const { user } = useUserContext();
    return user?.isAdmin ? <AdminDisplayStats /> : <DisplayUserStats />;
};

interface DisplayStatsProps {
    optionalUser? : User
}

const AdminDisplayStats = () => {
    return(
        <div>
        </div>
    )
}

const DisplayUserStats = ({optionalUser} : DisplayStatsProps) => {
    const {user} = useUserContext();
    const [applications, setApplications] = useState<Application[]>([]);
    const [grants, setGrants] = useState<Grant[]>([]);
    const header = ["Category", "Frequency", { role: "style" }];

    const options = {
        'fontName': 'SF-Compact-Rounded-Regular',
        'backgroundColor': 'transparent',
        'tooltip' : {
            trigger: 'none'
          },
        'vAxis': {
            gridlines: {
                color: 'transparent'
            },
            textPosition: 'none',
            baselineColor: '#000000'
          },
        'legend': {
            position: 'none'
        },
    }

    useEffect(() => {
        if (user) {
            ApplicationsController.fetchUserApplications(user).then((applications: Application[]) => {
                setApplications(applications);
            });
        }
        
        if (optionalUser) {
            ApplicationsController.fetchUserApplications(optionalUser).then((applications: Application[]) => {
                setApplications(applications);
            });
        }
    }, [user, optionalUser]);

    useEffect(() => {
        if (user) {
            GrantsController.fetchGrants(appliedGrants(applications)).then((grants: Grant[] | undefined) => {
                if (grants) {
                    setGrants(grants);
                }
            });
        }

    }, [user]);

    const grantsAwarded = countTotalAwardedAmount(applications);

    const grantCategoriesData = formatData(
        countCategories(applications), 
    header);

    const applicationsSubmitted = countApplicationsSubmitted(applications);
    const applicationsInProgress = countApplicationsInProgress(applications);
    const applicationsResolved = countApplicationsResolved(applications);
    const applicationsApproved = countApplicationsApproved(applications);
    const applicationsRejected = countApplicationsRejected(applications);

    const grantStatusData = formatData({
        [`Submitted: ${applicationsSubmitted}`]: applicationsSubmitted,
        [`In Progress: ${applicationsInProgress}`]: applicationsInProgress,
        [`Resolved: ${applicationsResolved}`]: applicationsResolved,
        [`Approved: ${applicationsApproved}`]: applicationsApproved,
        [`Rejected: ${applicationsRejected}`]: applicationsRejected
    }, header);

    return(
        <div className='overflow-auto py-10 px-20 h-[90vh]'>
            <div className=" bg-white  rounded-xl border-4 border-primary shadow-2xl shadow-black"> 
                <div className="flex items-center mt-10">
                    <div className="m-10 text-center text-3xl">Total Grant Funding Applied (Max Estimate): ${countTotalAppliedAmount(grants)}</div>
                    <div className="m-10 text-center text-3xl">Total Grant Funding Received: ${grantsAwarded}</div>
                </div>
                
                <div className="flex items-center">
                    <div className="m-10 ml-20 text-center text-3xl">Grant Categories Breakdown</div>
                    <Chart chartType="ColumnChart" width="100%" height="400px" data={grantCategoriesData} options={options} />
                </div>
                
                <div className="flex items-center">
                    <div className="m-10 text-center text-3xl">Grant Status Breakdown</div>
                    <Chart chartType="ColumnChart" width="100%" height="400px" data={grantStatusData} options={options} />
                </div>
            </div>
        </div>   
    );
}

const countCategories = (applications: Application[]) => 
{
    const data: TableValues = {};
    for (const application of applications)
    {
        data[application.grantCategory] = data[application.grantCategory] ? data[application.grantCategory] + 1 : 1;
    }

    const result: TableValues = {};
    for (const key in data)
    {
        result[key + `: ${data[key]}`] = data[key];
    }
    return result;
}

const formatData = (values: TableValues, header: any[]) =>
{
    let colors: string[] = ["#22525D", "#7DB8B7"];
    let i: number = 0;
    let result: (string | number)[][] = [];
    result.push(header)
    for (const key in values)
    {
        let arr: (string | number)[] = [];
        
        arr.push(key);
        arr.push(values[key]);
        arr.push(colors[i % colors.length]);
        i = i + 1;
        result.push(arr);
    }
    return result
}

const countApplicationsSubmitted = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.submitted).length;

const countApplicationsInProgress = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.inProgress).length;

const countApplicationsResolved = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.resolved).length;

const countApplicationsApproved = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.approved).length;

const countApplicationsRejected = (applications: Application[]) =>  applications.filter((application) => application.status === ApplicationStatus.rejected).length;

const appliedGrants = (applications: Application[]) => {
    const values: Application[] = applications.filter((application) => application.status !== ApplicationStatus.rejected)
    const grants: string[] = [];
   
    for (let i=0; i<values.length; i++)
    {
        grants.push(values[i].grantID)
    }

    return grants
}
const countTotalAppliedAmount = (grants: Grant[]) => grants.reduce((n, {maxAmount}) => n + maxAmount.valueOf(), 0);

const countTotalAwardedAmount = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.approved).reduce((n, {awarded}) => n + awarded, 0);

export {GrantStatsPage, DisplayUserStats};