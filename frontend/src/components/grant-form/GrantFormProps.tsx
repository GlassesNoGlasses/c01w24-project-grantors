import { GrantQuestion } from "../interfaces/Grant";

export interface QuestionListProps {
    username: string | undefined
    grantId: String | undefined;
    questions: GrantQuestion[];
   
    
}