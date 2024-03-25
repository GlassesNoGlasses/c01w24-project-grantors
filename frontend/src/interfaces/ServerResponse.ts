import { Applicant } from "./Applicant";
import { Application } from "./Application";
import { ApplicationReview } from "./ApplicationReview";
import { Grant } from "./Grant";

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

export interface GetReviewResponse {
    response?: ApplicationReview,
    error?: string,
}