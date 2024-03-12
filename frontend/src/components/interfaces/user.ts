import { Grant } from './Grant'
/* Inferface of Users to be used. */
export interface User {
    accountID: string | null,
    isAdmin: boolean,
    username: String | null,
    firstName: String | null,
    lastName: String | null,
    email: String | null, 
    password: String | null,
    grants?: Grant[]
}

