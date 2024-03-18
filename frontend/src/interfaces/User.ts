/* Inferface of Users to be used. */
export interface User {
    accountID: string,
    isAdmin: boolean,
    username: String | null,
    firstName: String | null,
    lastName: String | null,
    email: String | null, 
    organization?: string,
    authToken: string,
}
