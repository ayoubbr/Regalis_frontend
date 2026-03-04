export interface UserProgress {
    id: number;
    userId: number;
    lessonId: number;
    completed: boolean;
    completionDate: string | null; // LocalDateTime as ISO string
}

export interface UserProgressCreateDTO {
    userId: number;
    lessonId: number;
}

export interface UserProgressUpdateDTO {
    completed: boolean;
}
