export interface Puzzle {
    id?: number;
    title?: string;
    description?: string;
    difficulty: number;
    xpReward: number;
    moduleId: number;
    moduleName?: string;
    situations?: Situation[];
}

export interface Situation {
    id?: number;
    fenPosition: string;
    correctMove: string;
    description?: string;
    puzzleId?: number;
}

export interface PuzzleCreateDTO {
    title: string;
    description: string;
    difficulty: number;
    xpReward: number;
    moduleId: number;
}

export interface PuzzleUpdateDTO {
    title: string;
    description: string;
    difficulty: number;
    xpReward: number;
    moduleId: number;
}
