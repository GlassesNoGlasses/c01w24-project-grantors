
export interface MessageFormProps {
    showModal: boolean,
    callbackOpen: () => void,
    callbackClose: () => void,
    senderEmail: String,
    receiverEmail?: String,
    applicantEmails: String[]
}
