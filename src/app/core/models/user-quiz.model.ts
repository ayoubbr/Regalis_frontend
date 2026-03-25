export interface UserQuiz {
    id: number;
    userId: number;
    quizId: number;
    completed: boolean;
    completionDate: string | null; // LocalDateTime as ISO string
}

export interface UserQuizCreateDTO {
    userId: number;
    quizId: number;
}

export interface UserQuizUpdateDTO {
    completed: boolean;
}
