import { ApplicationStatus } from "./Application";

export interface ApplicationReview {
    ID: string,
    applicationID: string,
    reviewerID: string,
    reviewText: string,
    rating: number,
    applicationStatus: ApplicationStatus,
}