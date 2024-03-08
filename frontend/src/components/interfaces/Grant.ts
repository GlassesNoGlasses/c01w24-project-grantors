export interface Grant {
    id: number;
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
}

export interface GrantQuestion {
    id: number;
    question: string;
    answer: string | null;
}