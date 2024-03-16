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