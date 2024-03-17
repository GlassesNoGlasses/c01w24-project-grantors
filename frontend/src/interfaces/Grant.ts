export interface GrantQuestion {
    id: number;
    question: string;
    answer: string | null;
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
    owner: string | null; // admin user id
}
