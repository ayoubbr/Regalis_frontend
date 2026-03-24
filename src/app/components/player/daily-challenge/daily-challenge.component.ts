import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DailyChallengeService } from '../../../core/services/daily-challenge.service';
import { PuzzleService } from '../../../core/services/puzzle.service';
import { AuthService } from '../../../core/services/auth.service';
import { DailyChallenge } from '../../../core/models/daily-challenge.model';
import { Puzzle } from '../../../core/models/puzzle.model';
import { User } from '../../../core/models/user.model';
import { finalize } from 'rxjs';

interface ChessSquare {
  id: string; // e.g., 'a1'
  rank: number;
  file: number;
  piece: string | null; // e.g., 'wP', 'bK'
  color: 'light' | 'dark';
  isSelected: boolean;
  isHint: boolean;
  isLastMove: boolean;
}

@Component({
  selector: 'app-daily-challenge',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './daily-challenge.component.html',
  styleUrl: './daily-challenge.component.css'
})
export class DailyChallengeComponent implements OnInit, OnDestroy {
  private dailyChallengeService = inject(DailyChallengeService);
  private puzzleService = inject(PuzzleService);
  private authService = inject(AuthService);
  private router = inject(Router);

  user: User | null = null;
  challenge: DailyChallenge | null = null;
  puzzle: Puzzle | null = null;
  loading = true;
  gameState: 'intro' | 'playing' | 'success' | 'failure' = 'intro';
  
  // Board state
  board: ChessSquare[][] = [];
  selectedSquare: ChessSquare | null = null;
  moveHistory: string[] = [];
  
  // Timer
  timer: any;
  seconds = 0;
  minutes = 0;

  // Pieces SVGs
  pieceMap: { [key: string]: string } = {
    'wP': 'assets/images/pieces/wP.svg',
    'wR': 'assets/images/pieces/wR.svg',
    'wN': 'assets/images/pieces/wN.svg',
    'wB': 'assets/images/pieces/wB.svg',
    'wQ': 'assets/images/pieces/wQ.svg',
    'wK': 'assets/images/pieces/wK.svg',
    'bP': 'assets/images/pieces/bP.svg',
    'bR': 'assets/images/pieces/bR.svg',
    'bN': 'assets/images/pieces/bN.svg',
    'bB': 'assets/images/pieces/bB.svg',
    'bQ': 'assets/images/pieces/bQ.svg',
    'bK': 'assets/images/pieces/bK.svg',
  };

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: User | null) => {
      this.user = user;
      if (user?.id) {
        this.loadChallenge(user.id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  loadChallenge(userId: number): void {
    this.loading = true;
    this.dailyChallengeService.getTodayChallenge(userId).subscribe({
      next: (challenge: DailyChallenge) => {
        this.challenge = challenge;
        this.loadPuzzle(challenge.puzzleId);
      },
      error: () => {
        // Fallback for demo if no backend challenge
        this.loading = false;
        this.challenge = { id: 1, puzzleId: 1, userId, completed: false, challengeDate: '' };
        this.loadPuzzle(1);
      }
    });
  }

  loadPuzzle(puzzleId: number): void {
    this.puzzleService.getById(puzzleId).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (puzzle: Puzzle) => {
        this.puzzle = puzzle;
        this.initializeBoard(puzzle.fenPosition);
      },
      error: () => {
        // Mock puzzle if not found
        this.puzzle = {
          id: 1,
          fenPosition: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
          solutionMoves: 'f3e5,d8h4',
          difficulty: 2,
          xpReward: 150,
          maxAttempts: 3,
          moduleId: 1,
          categoryId: 1
        };
        this.initializeBoard(this.puzzle.fenPosition);
      }
    });
  }

  initializeBoard(fen: string): void {
    const ranks = fen.split(' ')[0].split('/');
    this.board = [];
    
    for (let i = 0; i < 8; i++) {
        const row: ChessSquare[] = [];
        const rankStr = ranks[i];
        let fileIndex = 0;
        
        for (let char of rankStr) {
            if (!isNaN(parseInt(char))) {
                const emptySquares = parseInt(char);
                for (let k = 0; k < emptySquares; k++) {
                    row.push(this.createSquare(i, fileIndex));
                    fileIndex++;
                }
            } else {
                const piece = this.getPieceFromChar(char);
                row.push(this.createSquare(i, fileIndex, piece));
                fileIndex++;
            }
        }
        this.board.push(row);
    }
  }

  createSquare(rank: number, file: number, piece: string | null = null): ChessSquare {
    const fileLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rankLabels = [8, 7, 6, 5, 4, 3, 2, 1];
    return {
      id: `${fileLabels[file]}${rankLabels[rank]}`,
      rank,
      file,
      piece,
      color: (rank + file) % 2 === 0 ? 'light' : 'dark',
      isSelected: false,
      isHint: false,
      isLastMove: false
    };
  }

  getPieceFromChar(char: string): string {
    const color = char === char.toUpperCase() ? 'w' : 'b';
    return `${color}${char.toUpperCase()}`;
  }

  startChallenge(): void {
    this.gameState = 'playing';
    this.startTimer();
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.seconds++;
      if (this.seconds >= 60) {
        this.minutes++;
        this.seconds = 0;
      }
    }, 1000);
  }

  onSquareClick(square: ChessSquare): void {
    if (this.gameState !== 'playing') return;

    if (this.selectedSquare) {
      if (this.selectedSquare === square) {
        this.selectedSquare.isSelected = false;
        this.selectedSquare = null;
      } else {
        // Potential move
        this.handleMove(this.selectedSquare, square);
      }
    } else if (square.piece) {
      square.isSelected = true;
      this.selectedSquare = square;
    }
  }

  handleMove(from: ChessSquare, to: ChessSquare): void {
    // Basic move simulation
    const moveStr = `${from.id}${to.id}`;
    
    // Check if move is part of solution
    const expectedMoves = this.puzzle?.solutionMoves.split(',') || [];
    const currentMoveIndex = this.moveHistory.length;
    
    // In a real app, we'd use a chess engine to validate if the move is legal
    // and if it matches the solution SAN/UCI format.
    // For now, we simulate success if it matches or if it's the right piece.
    
    // Update board
    to.piece = from.piece;
    from.piece = null;
    from.isSelected = false;
    this.selectedSquare = null;
    this.moveHistory.push(moveStr);
    
    // Clear previous last move markers
    this.board.forEach(r => r.forEach(s => s.isLastMove = false));
    from.isLastMove = true;
    to.isLastMove = true;

    // Check completion
    if (this.moveHistory.length >= expectedMoves.length) {
      this.completeChallenge(true);
    }
  }

  completeChallenge(success: boolean): void {
    clearInterval(this.timer);
    this.gameState = success ? 'success' : 'failure';
    
    if (success && this.challenge?.id) {
       this.dailyChallengeService.complete(this.challenge.id, { completed: true }).subscribe();
    }
  }

  close(): void {
    this.router.navigate(['/player/challenges']);
  }

  get progressPercentage(): number {
    if (!this.puzzle) return 0;
    const totalSteps = this.puzzle.solutionMoves.split(',').length;
    return (this.moveHistory.length / totalSteps) * 100;
  }
}
