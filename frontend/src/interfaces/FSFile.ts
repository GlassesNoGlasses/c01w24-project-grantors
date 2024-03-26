
export interface FSFile {
    id: string;
    accountID: string;
    title: string;
    posted: Date;
    path: string;
    mimetype: string;
    organization?: string;
    file: File | undefined,
}
