
export interface MessageFormProps {
    title: string,
    showModal: boolean,
    callbackOpen: () => void,
    callbackClose: () => void,
    setCreatedMessage?: (created: boolean) => void,
    senderEmail: string,
    receiverEmail?: string,
    applicantEmails: string[]
}
