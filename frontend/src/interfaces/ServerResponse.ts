import { Applicant } from "./Applicant";
import { Application } from "./Application";
import { FSFile } from "./FSFile";
import { ApplicationReview } from "./ApplicationReview";
import { Grant } from "./Grant";
import { Message } from "./Message";

export interface ServerLoginResponse {
    accountID: string,
    isAdmin: boolean,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    organization?: string,
    authToken: string
}

export interface GetGrantResponse {
    response?: Grant,    
    error?: string,
};

export interface GetGrantsResponse {
    response?: Grant[],    
    error?: string,
};

export interface GetApplicationResponse {
    response?: Application,
    error?: string,
};

export interface GetApplicationsResponse {
    response?: Application[],
    error?: string,
};

export interface CreateObjectResponse {
    response?: string,
    id?: string,
    error?: string,
};

export interface GetApplicantResponse {
    response?: Applicant,
    error?: string,
}

export interface GetApplicantsResponse {
    response?: Applicant[],
    error?: string,
}

export interface UploadFilesResponse {
    response?: string,
    insertedCount?: number,
    error?: string,
}

export interface GetFSFileResponse {
    response?: FSFile,
    error?: string,
}

export interface GetFSFilesResponse {
    response?: FSFile[],
    error?: string,
}
export interface GetReviewResponse {
    response?: ApplicationReview,
    error?: string,
}

export interface GetMessagesResponse {
    response?: Message[],
    error?: string,
}

export interface GetMessageResponse {
    response?: Message,
    error?: string,
}
