/* Inferface of Users to be used. */
export enum UserTypes {
    admin = "admin",
    grantor = "grantor",
    grantee = "grantee", 
}

export interface User {
    accountID: string,
    isAdmin: boolean,
    isSysAdmin: boolean
    username: String | null,
    firstName: String | null,
    lastName: String | null,
    email: String | null, 
    organization?: string,
    authToken: string,
    preferences: {hc: boolean, sbg: boolean}
}
