export interface AdminNote {
    id: number;
    message: string;
    userId: number;
    createdAt: string; // LocalDateTime as ISO string
}

export interface AdminNoteCreateDTO {
    message: string;
    userId: number;
}

export interface AdminNoteUpdateDTO {
    message: string;
}
