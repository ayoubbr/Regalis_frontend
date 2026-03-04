export interface DailyChallenge {
    id: number;
    challengeDate: string; // LocalDate as ISO string
    puzzleId: number;
    userId: number;
    completed: boolean;
}

export interface DailyChallengeCreateDTO {
    challengeDate: string; // LocalDate as ISO string
    puzzleId: number;
    userId: number;
}

export interface DailyChallengeUpdateDTO {
    completed: boolean;
}
