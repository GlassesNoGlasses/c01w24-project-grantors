export interface MilestoneEvidence {
    text: string;
    files: string[];
}

export enum GrantQuestionType {
    TEXT = "Text",
    DROP_DOWN = "Drop Down",
    CHECKBOX = "Checkbox",
    RADIO = "Radio",
    FILE = "File",
    NULL = "Null",
}

export interface GrantQuestion {
    id: number;
    question: string;
    answer?: string;
    type: GrantQuestionType;
    options: string[];
    required: boolean;
}

export interface GrantMilestone {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    evidence: MilestoneEvidence;
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
    milestones: GrantMilestone[];
    publish: boolean;
}
