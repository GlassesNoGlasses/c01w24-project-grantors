import { Application } from "../interfaces/Application";

export interface ApplicationFilterProps {
    applications: Application[],
    setApplications: (applications: Application[]) => void,
};