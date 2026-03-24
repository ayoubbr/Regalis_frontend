export interface QuizOption {
    id: string;
    label: string;
    text: string;
    isCorrect?: boolean;
}

export interface QuizQuestion {
    id: number;
    text: string;
    options: QuizOption[];
    correctOptionId: string;
    hint?: string;
    xpReward?: number;
}

export interface QuizResult {
    questionId: number;
    selectedOptionId: string;
    isCorrect: boolean;
    timeSpent: number;
}
