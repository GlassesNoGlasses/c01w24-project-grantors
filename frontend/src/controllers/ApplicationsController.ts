import { SERVER_PORT } from "../constants/ServerConstants";
import { Application } from "../interfaces/Application";
import { GetApplicationsResponse } from "../interfaces/ServerResponse";
import { User } from "../interfaces/User";

export default class ApplicationsController {

    static async fetchUserApplications(user: User): Promise<Application[]> {
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/applications?userID=${user.accountID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.authToken}`
                },
            });

            if (res.ok) {
                return await res.json().then((data: GetApplicationsResponse) => {
                    return data.response ?? [];
                });
            } else {
                // Bad response, logout the user and redirect
                console.error("Failed to fetch user applications", res);
                return [];
            }
        } catch (error) {
            console.error("Error while fetching user applications", error);
            return [];
        }
    }

    static async fetchOrgApplications(user: User): Promise<Application[] | undefined> {
        if (!user.organization) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/applications?organization=${user.organization}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.authToken}`
                },
            });

            if (res.ok) {
                return await res.json().then((data: GetApplicationsResponse) => {
                    if (data.response) {
                        return data.response.map((application: Application) => {
                            return {...application, submissionDate: new Date(application.submissionDate)};
                        });
                    }
                    return [];
                });
            } else {
                console.error("Server error fetching organization applications", res);
            }
        } catch (error) {
            console.error("Error fetching organization applications", error);
        }
    }

    static async submitApplication(user: User, application: Application): Promise<boolean> {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/application`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                        // TODO: send user.authToken to authenticate submission
                    },
                    body: JSON.stringify(application),
                })

            if (!response.ok) {
                console.error("Server failed:", response.status);
            }
            return response.ok;
        } catch (error) {
            console.log("Fetch function failed:", error);
            return false;
        }
    }
}