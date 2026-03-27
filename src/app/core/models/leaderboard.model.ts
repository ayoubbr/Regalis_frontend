export enum Period {
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    ALL_TIME = 'ALL_TIME'
}

export interface LeaderboardPlayer {
    id: number;
    period: Period;
    xp: number;
    rank: number;
    userId: number;
    username: string;
    imageUrl: string | null;
    level: number;
}
