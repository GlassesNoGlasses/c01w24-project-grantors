import { useUserContext } from '../contexts/userContext';
import { useEffect, useState } from "react";
import { GrantStatsPageProps, CategoryDictionary } from "./GrantStatsPageProps";
import ApplicationsController from "../../controllers/ApplicationsController"
import { Application, ApplicationStatus } from "../../interfaces/Application";
import { Chart } from "react-google-charts";

const GrantStatsPage = ({}: GrantStatsPageProps) => {

    return <DisplayStats />;
};

const DisplayStats = () => {
    const {user} = useUserContext();
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        if (user) {
            ApplicationsController.fetchUserApplications(user).then((applications: Application[]) => {
                setApplications(applications);
            });
            
        }
        console.log(applications);
    }, [user]);


    return(
        <div> 
            <h1 className="flex items-center w-full">this is the grant stats page</h1>
            <Chart
            chartType="ScatterChart"
            data={[["Age", "Weight"], [4, 5.5], [8, 12]]}
            width="100%"
            height="400px"
            legendToggle
            />
        </div>
    );
}



const countCategories = (applications: Application[]) => 
{
    const result: CategoryDictionary = {};
    for (const application of applications)
    {
        result[application.grantCategory] = result[application.grantCategory] ? result[application.grantCategory] + 1 : 1;
    }
    return result;
}

const countApplications = (applications: Application[]) => applications.length;

const countApplicationsSubmitted = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.submitted).length;

const countApplicationsInProgress = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.inProgress).length;

const countApplicationsResolved = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.resolved).length;

const countApplicationsApproved = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.approved).length;

const countApplicationsRejected = (applications: Application[]) =>  applications.filter((application) => application.status === ApplicationStatus.rejected).length;

const countTotalAppliedAmount = (applications: Application[]) => applications.reduce((n, {awarded}) => n + awarded, 0);

const countTotalAwardedAmount = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.approved).reduce((n, {awarded}) => n + awarded, 0);

export default GrantStatsPage;