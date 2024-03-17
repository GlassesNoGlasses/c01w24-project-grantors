import { SERVER_PORT } from "../constants/ServerConstants";
import { Grant } from "../interfaces/Grant";
import { GetGrantResponse, GetGrantsResponse } from "../interfaces/ServerResponse";

export async function fetchGrant(grantId: String): Promise<Grant | undefined> {
    try {
        const response = await fetch(`http://localhost:${SERVER_PORT}/getGrant/${grantId}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            await response.json().then((data: GetGrantResponse) => {
                console.error("Failed to fetch grant: ", data.error);
            });
            return;
        }

        return await response.json().then((data: GetGrantResponse) => {
            const grant = data.response;
            if (grant) {
                return {...grant, deadline: new Date(grant.deadline), posted: new Date(grant.posted)};
            }
        });
    } catch (error) {
        console.error('error creating grant:', (error as Error).message);
    }
}

export async function fetchGrants(grantIDs: string[]): Promise<Grant[] | undefined> {
    const encodedGrantIDs: string = encodeURIComponent(grantIDs.join(','));
    const res = await fetch(`http://localhost:${SERVER_PORT}/getGrants/${encodedGrantIDs}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (res.ok) {
        return await res.json().then((data: GetGrantsResponse) => {
            if (data.response) {
                return data.response.map((grant) => {
                    return {...grant, deadline: new Date(grant.deadline), posted: new Date(grant.posted)};
                });
            }
        });
    } else {
        console.error("Error fetching grants", res);
    }
}

export async function fetchOrgGrants(organization: string): Promise<Grant[]> {
    try {
        const response = await fetch(`http://localhost:${SERVER_PORT}/getOrgGrants/${organization}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        return await response.json().then((data) => {
            const fetchedGrants: Grant[] = data['response'];
            console.log("Fetched Grants: ", fetchedGrants);

            const grants: Grant[] = fetchedGrants.map((grant: Grant) => {
                return {...grant, deadline: new Date(grant.deadline), posted: new Date(grant.posted)}
            });

            return grants;
        })
    } catch (error) {
        console.error('error creating grant:', (error as Error).message);
        return [];
    }
}