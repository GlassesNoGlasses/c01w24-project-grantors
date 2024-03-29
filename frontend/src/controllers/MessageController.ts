import { SERVER_PORT } from "../constants/ServerConstants";
import { Message } from "../interfaces/Message";
import { GetMessageResponse, GetMessagesResponse } from "../interfaces/ServerResponse";
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

    static async fetchMessage(messageID: string): Promise<Message | undefined> {
        try {
            if (!messageID) {
                return undefined;
            }

            const res = await fetch(`http://localhost:${SERVER_PORT}/getMessage/${messageID}`, {
                method: 'GET',
            });

            // Bad request, return undefined.
            if (!res.ok) {
                return undefined;
            }

            return await res.json().then((data: GetMessageResponse) => {
                if (data) {
                    return data.response;
                }
                
                console.error("Failed to get sent messages", data);
                return undefined;
            })

        } catch (error) {
            console.error("Error while fetching sent messages", error);
            return undefined;
        }
    };

    static async markMessageRead(message: Message): Promise<boolean> {
        try {
            if (!message.id) {
                return false;
            }

            const res = await fetch(`http://localhost:${SERVER_PORT}/markMessageRead/${message.id}`, {
                method: 'PUT',
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
            console.error("Error while fetching sent messages", error);
            return false;
        }
    };

    static async fetchSentMessages(user: User): Promise<Message[] | undefined> {
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
            console.error("Error while fetching sent messages", error);
            return undefined;
        }
    };

    static async fetchReceivedMessages(user: User): Promise<Message[] | undefined> {
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
            console.error("Error while fetching received messages", error);
            return undefined;
        }
    };

    static async fetchMessages(user: User): Promise<Message[] | undefined> {
        try {
            const messages: Message[] = [];

            await MessageController.fetchReceivedMessages(user).then((receivedMessages: Message[] | undefined) => {
                if (receivedMessages) {
                    messages.push(...receivedMessages);
                }
            });

            await MessageController.fetchSentMessages(user).then((sentMessages: Message[] | undefined) => {
                if (sentMessages) {
                    messages.push(...sentMessages);
                }
            });
            
            // Bad request, return undefined.
            if (!messages) {
                return undefined;
            }

            console.log(messages);

            return messages;

        } catch (error) {
            console.error("Error while fetching messages", error);
            return undefined;
        }
    };

}