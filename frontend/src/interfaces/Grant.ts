export enum GrantQuestionType {
    TEXT = "Text",
    MULTIPLE_CHOICE = "Multiple Choice",
    CHECKBOX = "Checkbox",
    DATE = "Date",
    NULL = "Null",
}

export interface GrantQuestion {
    id: number;
    question: string;
    answer: string | null;
    type: GrantQuestionType;
    options: string[];
}

export interface Grant {
    id: string;
    title: string;
    description: string;
    posted: Date;
    deadline: Date;
    minAmount: Number;
    maxAmount: Number;
    organization: string;
    category: string;
    contact: string;
    questions: GrantQuestion[];
    publish: boolean;
}
