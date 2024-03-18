import { SERVER_PORT } from "../constants/ServerConstants";
import { Grant } from "../interfaces/Grant";
import { CreateObjectResponse, GetGrantResponse, GetGrantsResponse } from "../interfaces/ServerResponse";
import { User } from "../interfaces/User";

export default class GrantsController {

    static async fetchGrant(grantID: String): Promise<Grant | undefined> {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/grant/${grantID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return await response.json().then((data: GetGrantResponse) => {
                const grant = data.response;
                if (grant) {
                    return {...grant, deadline: new Date(grant.deadline), posted: new Date(grant.posted)};
                } else {
                    console.error("Failed to fetch grant: ", data.error);
                }
            });
        } catch (error) {
            console.error('Error fetching grant:', (error as Error).message);
        }
    }

    static async fetchGrants(grantIDs: string[]): Promise<Grant[] | undefined> {
        const encodedGrantIDs: string = encodeURIComponent(grantIDs.join(','));
        const res = await fetch(`http://localhost:${SERVER_PORT}/grants/${encodedGrantIDs}`, {
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
            const response = await fetch(`http://localhost:${SERVER_PORT}/organization/${organization}/grants`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            return await response.json().then((data: GetGrantsResponse) => {
                if (data.response) {
                    const grants: Grant[] = data.response.map((grant: Grant) => {
                        return {...grant, deadline: new Date(grant.deadline), posted: new Date(grant.posted)}
                    });

                    return grants;
                } else {
                    console.error("Server error getting organization grants.", data.error);
                    return [];
                }
            });
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

            return await response.json().then((data: GetGrantsResponse) => {
                if (data.response) {
                    const grants: Grant[] = data.response.map((grant: Grant) => {
                        return {...grant, deadline: new Date(grant.deadline), posted: new Date(grant.posted)}
                    });

                    return grants;
                } else {
                    console.error("Failed to get user's favourite grants");
                    return [];
                }
            });

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
            const response = await fetch(`http://localhost:${SERVER_PORT}/grant/${grantID}`, {
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

    static async createGrant(user: User, grant: Grant): Promise<string | undefined> {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/grant`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                // TODO: Pass user's authToken to verify that this request is coming from 
                // someone in the grant.organization
                },
                body: JSON.stringify(grant),
            });

            return await response.json().then((data: CreateObjectResponse) => {
                if (data.id) {
                    return data.id
                } else {
                    console.error('Server error creating grant');
                }
            });

        } catch (error) {
            console.error('Error creating grant:', (error as Error).message);
        }
    }

    static async saveGrant(user: User, grant: Grant): Promise<boolean> {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/grant/${grant.id}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(grant),
            });

            if (!response.ok) {
                console.error('Error saving grant', response);
            }

            return response.ok;
        } catch (error) {
            console.error('Error saving grant:', (error as Error).message);
            return false;
        }
    }

    static async getPublishedGrants(): Promise<Grant[]> {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/grants/published`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            return await response.json().then((data: GetGrantsResponse) => {
                if (data.response) {
                    return data.response.map((grant: Grant) => {
                        return {...grant, deadline: new Date(grant.deadline), posted: new Date(grant.posted)}
                    });
                }
                console.error("Server error fetching grants.", data.error);
                return [];
            });
        } catch (error) {
            console.error('Error fetching grants:', (error as Error).message);
            return [];
        }
    }
}