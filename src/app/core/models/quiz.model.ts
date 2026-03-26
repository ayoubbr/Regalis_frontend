export interface QuizOption {
    id: string; // The text of the option itself or a unique ID
    label: string; // A, B, C, D
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

// Interface for what we get from Backend
export interface QuestionResponseDTO {
    id: number;
    text: string;
    options: string; // "Option A;Option B;Option C;Option D"
    correctOptionId: string;
    hint: string;
    xpReward: number;
}

export interface QuizResult {
    questionId: number;
    selectedOptionId: string;
    isCorrect: boolean;
    timeSpent: number;
}

export interface Quiz {
    id: number;
    title: string;
    content: string;
    difficulty: number;
    moduleId: number;
    imageUrl?: string;
    questions: QuestionResponseDTO[];
}

export interface QuizCreateDTO {
    title: string;
    content: string;
    difficulty: number;
    moduleId: number;
    imageUrl?: string;
}

export interface QuizUpdateDTO {
    title: string;
    content: string;
    difficulty: number;
    moduleId: number;
    imageUrl?: string;
}
