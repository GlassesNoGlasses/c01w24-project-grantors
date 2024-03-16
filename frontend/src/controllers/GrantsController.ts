import { SERVER_PORT } from "../constants/ServerConstants";
import { Grant } from "../interfaces/Grant";
import { GetGrantResponse } from "../interfaces/ServerResponses/GetGrantResponse";

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
            return data.response;
        });
    } catch (error) {
        console.error('error creating grant:', (error as Error).message);
    }
}