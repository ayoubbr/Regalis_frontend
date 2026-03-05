export interface UserPuzzleAttempt {
    id: number;
    userId: number;
    puzzleId: number;
    attemptsCount: number;
    solved: boolean;
    timeSpentSeconds: number;
    submittedMoves: string;
    attemptDate: string; // LocalDateTime as ISO string
}

export interface UserPuzzleAttemptCreateDTO {
    userId: number;
    puzzleId: number;
    attemptsCount: number;
    solved: boolean;
    timeSpentSeconds: number;
    submittedMoves: string;
}
