export enum ConditionType {
    STREAK = 'STREAK',
    XP = 'XP',
    PUZZLES_SOLVED = 'PUZZLES_SOLVED'
}

export interface Achievement {
    id: number;
    name: string;
    description: string;
    conditionType: ConditionType;
    conditionValue: number;
}

export interface AchievementCreateDTO {
    name: string;
    description: string;
    conditionType: ConditionType;
    conditionValue: number;
}

export interface AchievementUpdateDTO {
    name: string;
    description: string;
    conditionType: ConditionType;
    conditionValue: number;
}

export interface UserAchievement {
    id: number;
    userId: number;
    achievementId: number;
    unlockedDate: string; // LocalDateTime as ISO string
}
