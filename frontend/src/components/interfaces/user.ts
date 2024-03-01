/* Enum to determine if a login has occured. */
export enum UserType {
    Undetermined,
    Client,
    Admin,
};

/* Inferface of Users to be used. */
export interface User {
    id: number,
    type: UserType,
    username: string,
}
