import { SERVER_PORT } from "../constants/ServerConstants";
import { FSFile } from "../interfaces/FSFile";
import { Message } from "../interfaces/Message";
import { GetMessagesResponse } from "../interfaces/ServerResponse";
import { User } from "../interfaces/User";

export default class MessageController {

    // Returns true if message was sent successfully, false otherwise.
    static async sendMessage(message: Message, user: User): Promise<boolean> {
        try {
            const senderEmail = user.email;

            if (!senderEmail) {
                return false;
            }

            const res = await fetch(`http://localhost:${SERVER_PORT}/sendMessage/${senderEmail}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            // Bad request, return false.
            if (!res.ok) {
                return false;
            }

            return res.ok;

        } catch (error) {
            console.error("Error while uploading files", error);
            return false;
        }
    };

    static async getSentMessages(user: User): Promise<Message[] | undefined> {
        try {
            const senderEmail = user.email;

            if (!senderEmail) {
                return undefined;
            }

            const res = await fetch(`http://localhost:${SERVER_PORT}/getSentMessages/${senderEmail}`, {
                method: 'GET',
            });

            // Bad request, return undefined.
            if (!res.ok) {
                return undefined;
            }

            return await res.json().then((data: GetMessagesResponse) => {
                if (data.response) {
                    return data.response;
                }
                
                console.error("Failed to get sent messages", data.error);
                return undefined;
            })

        } catch (error) {
            console.error("Error while uploading files", error);
            return undefined;
        }
    };

    static async getReceivedMessages(user: User): Promise<Message[] | undefined> {
        try {
            const senderEmail = user.email;

            if (!senderEmail) {
                return undefined;
            }

            const res = await fetch(`http://localhost:${SERVER_PORT}/getReceivedMessages/${senderEmail}`, {
                method: 'GET',
            });

            // Bad request, return undefined.
            if (!res.ok) {
                return undefined;
            }

            return await res.json().then((data: GetMessagesResponse) => {
                if (data.response) {
                    return data.response;
                }
                
                console.error("Failed to get received messages", data.error);
                return undefined;
            })

        } catch (error) {
            console.error("Error while uploading files", error);
            return undefined;
        }
    };

}