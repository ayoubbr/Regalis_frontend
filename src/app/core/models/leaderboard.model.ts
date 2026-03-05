export enum Period {
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    ALL_TIME = 'ALL_TIME'
}

export interface LeaderboardEntry {
    id: number;
    period: Period;
    xp: number;
    rank: number;
    userId: number;
}
