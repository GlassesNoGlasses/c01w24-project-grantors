import { SERVER_PORT } from "../constants/ServerConstants";
import { Application } from "../interfaces/Application";
import { GetUserApplicationsResponse } from "../interfaces/ServerResponse";
import { User } from "../interfaces/User";

export async function fetchApplications(user: User): Promise<Application[] | undefined> {
    const res = await fetch(`http://localhost:${SERVER_PORT}/getUserApplications/${user?.accountID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.authToken}`
        },
      });

    if (res.ok) {
        return await res.json().then((data: GetUserApplicationsResponse) => {
            return data.response;
        });
    } else {
        // Bad response, logout the user and redirect
        console.log("Failed to fetch user applications", res);
    }
}