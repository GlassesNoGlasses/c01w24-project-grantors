import { Cookies } from "react-cookie";
import { SERVER_PORT } from "../constants/ServerConstants";
import { User } from "../interfaces/User";
import { GetApplicantResponse } from "../interfaces/ServerResponse";
import { Applicant } from "../interfaces/Applicant";


export default class UserController {

    private static cookies = new Cookies();

    static async loginUser(username: string, password: string): Promise<User | Response | undefined> {
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                return await res.json().then((data: User) => {
                    this.cookies.set(
                            'user-token',
                            data.authToken, 
                            { 
                                path: '/',
                                expires: new Date(Date.now() + 1000 * 60 * 60)
                            });

                    return data;
                });
            } else {
                console.error("Failed to login", res);
                return res;
            }
        } catch (error) {
            console.error("Error while logging in", error);
        }
    }

    static logoutUser() {
        this.cookies.remove('user-token');
    }

    static async signupUser(username: string, password: string, email: string, 
            firstName: string, lastName: string, organization: string, isAdmin: boolean): Promise<Response | undefined> {
    
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email, firstName, lastName, organization, isAdmin }),
            });

            return res;
        } catch (error) {
            console.error("Error while signing up", error);
        }
    }

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

    static async fetchApplicant(applicantID: string): Promise<Applicant | undefined> {
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/applicant/${applicantID}`, {
                method: 'GET',
            });

            return await res.json().then((data: GetApplicantResponse) => {
                if (data.error) {
                    console.error("Server error fetching applicant:", data.error);
                    return;
                }
                return data.response;
            });
        } catch (error) {
            console.error("Error while fetching user", error);
        }
    }
}