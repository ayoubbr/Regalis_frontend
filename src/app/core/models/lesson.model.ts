export interface Lesson {
    id: number;
    title: string;
    content: string;
    difficulty: number;
    xpReward: number;
    moduleId: number;
}

export interface LessonCreateDTO {
    title: string;
    content: string;
    difficulty: number;
    xpReward: number;
    moduleId: number;
}

export interface LessonUpdateDTO {
    title: string;
    content: string;
    difficulty: number;
    xpReward: number;
    moduleId: number;
}
