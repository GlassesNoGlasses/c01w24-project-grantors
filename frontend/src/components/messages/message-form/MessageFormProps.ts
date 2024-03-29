
export interface MessageFormProps {
    title: String,
    showModal: boolean,
    callbackOpen: () => void,
    callbackClose: () => void,
    senderEmail: String,
    receiverEmail?: String,
    applicantEmails: String[]
}
