export interface UserPuzzle {
    id: number;
    userId: number;
    puzzleId: number;
    attemptsCount: number;
    solved: boolean;
    timeSpentSeconds: number;
    submittedMoves: string;
    attemptDate: string; // LocalDateTime as ISO string
}

export interface UserPuzzleCreateDTO {
    userId: number;
    puzzleId: number;
    attemptsCount: number;
    solved: boolean;
    timeSpentSeconds: number;
    submittedMoves: string;
}
