import { FSFile } from "./FSFile";

export interface Message {
    id: String,
    title: String,
    senderEmail: String, // email of person sending message
    receiverEmail: String, // email of person receiving message
    description: String,
    dateSent: Date,
    Files?: FSFile[]
}