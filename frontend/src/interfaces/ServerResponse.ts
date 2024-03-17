import { Application } from "./Application";
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

export interface GetUserApplicationsResponse {
    response?: Application[],
    error?: string,
}

export interface GetFavouriteGrantsResponse {
    response?: Grant[],
    error?: string,
}