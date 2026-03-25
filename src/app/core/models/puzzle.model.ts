export interface Situation {
    id: number;
    fenPosition: string;
    solutionMoves: string;
    description: string;
}

export interface Puzzle {
    id: number;
    fenPosition: string;
    title: string;
    description: string;
    solutionMoves: string;
    difficulty: number;
    xpReward: number;
    maxAttempts: number;
    moduleId: number;
    situations?: Situation[];
}

export interface PuzzleCreateDTO {
    fenPosition: string;
    title: string;
    description: string;
    solutionMoves: string;
    difficulty: number;
    xpReward: number;
    maxAttempts: number;
    moduleId: number;
}

export interface PuzzleUpdateDTO {
    fenPosition: string;
    title: string;
    description: string;
    solutionMoves: string;
    difficulty: number;
    xpReward: number;
    maxAttempts: number;
    moduleId: number;
}
