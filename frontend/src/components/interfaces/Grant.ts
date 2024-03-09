export interface GrantQuestion {
    id: number;
    question: string;
    answer: string | null;
}

export interface Grant {
    id: number;
    title: string;
    description: string;
    posted: Date;
    deadline: Date;
    minAmount: number;
    maxAmount: number;
    organization: string;
    category: string;
    contact: string;
    questions: GrantQuestion[];
    publish: boolean;
}
