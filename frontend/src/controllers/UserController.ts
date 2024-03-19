import { SERVER_PORT } from "../constants/ServerConstants";
import { User } from "../interfaces/User";


export default class UserController {

    static async fetchUser(authToken: string): Promise<User | undefined> {
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/user`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (res.ok) {
                return await res.json().then((data: { response: User }) => {
                    return data.response;
                });
            } else {
                console.error("Failed to fetch user", res);
            }
        } catch (error) {
            console.error("Error while fetching user", error);
        }
    }

}