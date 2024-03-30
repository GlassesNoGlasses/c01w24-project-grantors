import { useUserContext } from '../contexts/userContext';
import { useEffect, useState } from "react";
import { GrantStatsPageProps, TableValues } from "./GrantStatsPageProps";
import ApplicationsController from "../../controllers/ApplicationsController"
import { Application, ApplicationStatus } from "../../interfaces/Application";
import { Chart } from "react-google-charts";
import {User} from '../../interfaces/User'

const GrantStatsPage = ({}: GrantStatsPageProps) => {
    const { user } = useUserContext();
    return user?.isAdmin ? <DisplayAdminStats/> : <DisplayUserStats />;
};

interface DisplayStatsProps {
    optionalUser? : User
}

const DisplayAdminStats = () => {
    return <div></div>
}

const DisplayUserStats = ({optionalUser} : DisplayStatsProps) => {
    const {user} = useUserContext();
    const [applications, setApplications] = useState<Application[]>([]);
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
            ApplicationsController.fetchUserApplications(user, user).then((applications: Application[]) => {
                setApplications(applications);
            });
        }
        
        if (optionalUser && user) {
            ApplicationsController.fetchUserApplications(optionalUser, user).then((applications: Application[]) => {
                setApplications(applications);
            });
        }
    }, [user, optionalUser]);

    const grantsApplied = countTotalAppliedAmount(applications);
    const grantsAwarded = countTotalAwardedAmount(applications);

    const grantValueData = formatData({
        [`Applied Amount: ${grantsApplied}`]: grantsApplied, 
        [`Received Amount: ${grantsAwarded}`]: grantsAwarded
    }, header)

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
        [`Approved: ${applicationsApproved}`]: applicationsApproved,
        [`Rejected: ${applicationsRejected}`]: applicationsRejected
    }, header);

    return(
        <div className='overflow-auto py-10 px-20 h-[90vh]'>
            <div className=" flex flex-col items-center bg-white pt-4 rounded-xl border-4 border-primary shadow-2xl shadow-black justify-around"> 
                <h1 className="text-4xl ">Grant Statistics</h1>
                <div className="flex items-center">
                    <h2 className="m-10 text-center text-3xl">Total Grant Funding Received</h2>
                    <div className="m-10 text-center text-3xl">${grantsAwarded}</div>
                    <Chart chartType="ColumnChart" width="100%" height="400px" data={grantValueData} options={options} />
                </div>
                
                <div className="flex items-center">
                    <h2 className="m-10 ml-20 text-center text-3xl">Grant Categories Breakdown</h2>
                    <Chart chartType="ColumnChart" width="100%" height="400px" data={grantCategoriesData} options={options} />
                </div>
                
                <div className="flex items-center">
                    <h2 className="m-10 text-center text-3xl">Grant Status Breakdown</h2>
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

const countTotalAppliedAmount = (applications: Application[]) => applications.filter((application) => application.status != ApplicationStatus.rejected).reduce((n, {awarded}) => n + awarded, 0);

const countTotalAwardedAmount = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.approved).reduce((n, {awarded}) => n + awarded, 0);

export {GrantStatsPage, DisplayUserStats};