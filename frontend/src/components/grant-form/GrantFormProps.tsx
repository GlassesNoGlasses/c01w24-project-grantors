import { GrantQuestion } from "../interfaces/Grant";

export interface GrantFormProps {
    username: String | undefined | null
    grantId: String | undefined;
    questions: GrantQuestion[];
   
    
}