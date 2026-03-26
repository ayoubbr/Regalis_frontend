export interface UserQuiz {
    id: number;
    quizId: number;
    quizTitle?: string;
    completed: boolean;
    score: number;
    completionDate: string | null;
}

export interface UserAnswerDTO {
    questionId: number;
    selectedOptionId: string;
}

export interface UserQuizCreateDTO {
    userId: number;
    quizId: number;
}

export interface UserQuizUpdateDTO {
    completed?: boolean;
    answers: UserAnswerDTO[];
}
