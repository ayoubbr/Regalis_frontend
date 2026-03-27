export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface User {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName: string;
    role: string;
    imageUrl: string;
    totalXp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string; // LocalDate as ISO string
    createdAt: string; // LocalDateTime as ISO string
}

export interface UserCreateDTO {
    username: string;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role: Role;
}

export interface UserUpdateDTO {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role: Role;
}

export interface PaginatedResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
