export enum GrantQuestionType {
    TEXT = "Text",
    DROP_DOWN = "Drop Down",
    CHECKBOX = "Checkbox",
    RADIO = "Radio",
    NULL = "Null",
}

export interface GrantQuestion {
    id: number;
    question: string;
    answer?: string;
    type: GrantQuestionType;
    options: string[];
}

export interface GrantMilstone {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    evidence: string;
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
    milestones: GrantMilstone[];
    publish: boolean;
}
