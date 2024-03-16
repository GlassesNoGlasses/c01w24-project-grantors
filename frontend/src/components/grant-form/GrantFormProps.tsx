import { GrantQuestion } from "../../interfaces/Grant";

export interface QuestionListProps {
    username: String | undefined | null
    grantId: String | undefined;
    questions: GrantQuestion[];
   
    
}