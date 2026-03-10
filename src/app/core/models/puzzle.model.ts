export interface Puzzle {
    id: number;
    fenPosition: string;
    solutionMoves: string;
    difficulty: number;
    xpReward: number;
    maxAttempts: number;
    moduleId: number;
    categoryId: number;
}

export interface PuzzleCreateDTO {
    fenPosition: string;
    solutionMoves: string;
    difficulty: number;
    xpReward: number;
    maxAttempts: number;
    moduleId: number;
    categoryId: number;
}

export interface PuzzleUpdateDTO {
    fenPosition: string;
    solutionMoves: string;
    difficulty: number;
    xpReward: number;
    maxAttempts: number;
    moduleId: number;
    categoryId: number;
}
