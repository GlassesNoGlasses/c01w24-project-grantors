import { Cookies } from "react-cookie";
import { SERVER_PORT } from "../constants/ServerConstants";
import { User } from "../interfaces/User";
import { GetApplicantResponse, GetApplicantsResponse } from "../interfaces/ServerResponse";
import { Applicant } from "../interfaces/Applicant";
import { Message } from "../interfaces/Message";


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

    static async signupUser(username: string, password: string, email: string, firstName: string, 
        lastName: string, organization: string, isAdmin: boolean, isSysAdmin: boolean): Promise<Response | undefined> {
            
        
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email, firstName, lastName, organization, isAdmin, isSysAdmin }),
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

    static async fetchAUser(uid: string): Promise<User | undefined> {
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/user/${uid}`, {
                method: 'GET',
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

    static async fetchUsers(authToken: string): Promise<User[] | undefined> {
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/users`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (res.ok) {
                return await res.json().then((data: { users: User[] }) => {
                    return data.users;
                });
            } else {
                console.error("Failed to fetch users", res);
            }
        } catch (error) {
            console.error("Error while fetching users", error);
        }
    }

    static async updateUser(userId: string, username: string, email: string, 
                            firstName: string, lastName: string, password: string): Promise<String | undefined> {
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/users/${userId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({
                    username: username,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                })
            });

            if (res.ok) {
                return await res.json().then((data: { message: string}) => {
                    return data.message;
                });
            } else {
                console.error("Failed to update user", res);
            }
        } catch (error) {
            console.error("Error while updating users", error);
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

    static async fetchApplicants(applicantIDs: string[]): Promise<Applicant[]> {
        const encodedApplicantIDs: string = encodeURIComponent(applicantIDs.join(','));
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/applicants?applicantIDs=${encodedApplicantIDs}`, {
                method: 'GET',
            });

            return await res.json().then((data: GetApplicantsResponse) => {
                if (data.response) {
                    return data.response;
                }
                console.error("Server error fetching applicant:", data.error);
                return [];
            });
        } catch (error) {
            console.error("Error while fetching user", error);
            return []
        }
    }

    static async updatePreference(userId: string, preferences: {}): Promise<Boolean> {
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/users/${userId}/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences)
            });
            
            if (res.ok) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error("Error while updating preferences", error);
            return false
        }
    }

    static async fetchMessageSender(message: Message, user: User): Promise<User | undefined> {
        if (message.receiverEmail !== user.email && message.senderEmail !== user.email) {
            return undefined;
        }

        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/users/${message.senderEmail}`, {
                method: 'GET',
            });
            
            if (!res.ok) {
                return undefined;
            }

            return await res.json().then((data: { response: User }) => {
                if (!data || !data.response) {
                    return undefined;
                }

                return data.response;
            });

        } catch (error) {
            console.error("Error while updating preferences", error);
            return undefined;
        };
    }
        
    static async deleteUser(userId: string): Promise<String> {
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            return await res.json().then((message: String) => {
                return message
            });

        } catch (error) {
            console.error("Error while updating preferences", error);
            return "Error while deleting"
        }
    }
}