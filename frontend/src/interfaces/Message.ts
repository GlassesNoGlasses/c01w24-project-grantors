
export interface Message {
    id: string,
    title: string,
    senderEmail: string, // email of person sending message
    receiverEmail: string, // email of person receiving message
    description: string,
    dateSent: Date,
    read: boolean,
    fileNames: string[],
}