
/* Inferface of Users to be used. */
export interface User {
    accountID: string,
    isAdmin: boolean,
    username: string,
    firstName: string | null,
    lastName: string | null,
    email: string, 
    password: string | null,
}
