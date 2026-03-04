export enum ChallengeStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED'
}

export interface Challenge {
    id: number;
    status: ChallengeStatus;
    winnerId: number | null;
    challengerId: number;
    opponentId: number;
    puzzleId: number;
    createdAt: string; // LocalDateTime as ISO string
}

export interface ChallengeCreateDTO {
    challengerId: number;
    opponentId: number;
    puzzleId: number;
}

export interface ChallengeUpdateDTO {
    status: ChallengeStatus;
    winnerId: number | null;
}
