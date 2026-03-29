export interface Question {
    id: number;
    text: string;
    options: string;
    correctOptionId: string;
    hint: string;
    xpReward: number;
}

export interface QuestionCreateDTO {
    quizId: number;
    text: string;
    options: string;
    correctOptionId: string;
    hint: string;
    xpReward: number;
}

export interface QuestionUpdateDTO {
    quizId: number;
    text: string;
    options: string;
    correctOptionId: string;
    hint: string;
    xpReward: number;
}
