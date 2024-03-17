import { GrantQuestion } from "./Grant";

export enum ApplicationStatus {
    submitted = "Submitted",
    inProgress = "In Progress",
    resolved = "Resolved",
}

export interface Application {
    id: number,
    userID: number,
    grantID: string,
    grantTitle: string, 
    grantCategory: string,
    submitted: boolean,
    submissionDate: Date,
    status: ApplicationStatus,
    awarded: number,
    responses: GrantQuestion[];
}