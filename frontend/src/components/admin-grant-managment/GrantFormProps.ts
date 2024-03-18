export enum GrantFormType {
    CREATE  = "create",
    EDIT = "edit",
};

export interface GrantFormProps {
    type: GrantFormType,
};