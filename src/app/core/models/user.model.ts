export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: Role;
    totalXp: number;
    level: number;
    currentStreak: number;
    lastActiveDate: string; // LocalDate as ISO string
    createdAt: string; // LocalDateTime as ISO string
}

export interface UserCreateDTO {
    username: string;
    email: string;
    password?: string;
    role: Role;
}

export interface UserUpdateDTO {
    email: string;
    password?: string;
    role: Role;
}
