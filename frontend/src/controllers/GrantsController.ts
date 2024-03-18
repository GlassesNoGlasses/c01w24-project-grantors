import { SERVER_PORT } from "../constants/ServerConstants";
import { Grant } from "../interfaces/Grant";
import { GetGrantResponse, GetGrantsResponse, GetFavouriteGrantsResponse } from "../interfaces/ServerResponse";
import { User } from "../interfaces/User";

export default class GrantsController {

    static async fetchGrant(grantId: String): Promise<Grant | undefined> {
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

    static async fetchGrants(grantIDs: string[]): Promise<Grant[] | undefined> {
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

    static async fetchOrgGrants(organization: string): Promise<Grant[]> {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/getOrgGrants/${organization}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            return await response.json().then((data) => {
                const fetchedGrants: Grant[] = data['response'];

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

    static async fetchFavouriteGrants(userID: string): Promise<Grant[]> {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/users/${userID}/favourites`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

            if (response.ok) {
                return await response.json().then((data: GetFavouriteGrantsResponse) => {
                    if (data.response) {
                        const grants: Grant[] = data.response.map((grant: Grant) => {
                            return {...grant, deadline: new Date(grant.deadline), posted: new Date(grant.posted)}
                        });

                        return grants;
                    } else {
                        return [];
                    }
                });
            } else {
                console.error("Failed to get user's favourite grants");
            }

            return [];

        } catch (error) {
            console.error("Error fetching favourite grants", error);
            return [];
        }
    }

    static async toggleFavouriteGrant(userID: string, grantID: string): Promise<boolean> {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/users/${userID}/favourites/toggle`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ grantID: grantID }),
            });

            return response.ok;

        } catch (error) {
            console.error('Error updating favorites:', error);
            return false;
        }
    }

    // function to delete a grant in the server with given id
    static async deleteGrant(user: User, grantID: string): Promise<boolean> {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/deleteGrant/${grantID}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              // TODO: Use user.authToken to authenticate request
              body: JSON.stringify({'accId': user.accountID}),
            });

            return response.ok;

        } catch (error) {
            console.error('Error deleting grant:', (error as Error).message);
            return false;
        }
    }
}