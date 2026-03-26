import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Puzzle, Situation } from '../../../core/models/puzzle.model';
import { AuthService } from '../../../core/services/auth.service';

interface ChessSquare {
  id: string;
  rank: number;
  file: number;
  piece: string | null;
  color: 'light' | 'dark';
  isSelected: boolean;
  isHint: boolean;
  isLastMove: boolean;
}

@Component({
  selector: 'app-active-situation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-situation.component.html',
  styleUrl: './active-situation.component.css'
})
export class ActiveSituationComponent implements OnInit, OnDestroy {
  @Input() puzzle!: Puzzle;
  @Output() completed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  currentSituationIndex = 0;
  currentSituation: Situation | null = null;
  gameState: 'intro' | 'playing' | 'success' | 'failure' | 'finished' = 'intro';

  board: ChessSquare[][] = [];
  selectedSquare: ChessSquare | null = null;
  moveHistory: string[] = [];

  timer: any;
  seconds = 0;
  minutes = 0;

  currentUserImageUrl: string = 'assets/images/characters/regalis-avatar.png';
  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to user image for premium avatar integration
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      if (user && user.imageUrl) {
        this.currentUserImageUrl = user.imageUrl;
      }
    });

    if (this.puzzle.situations && this.puzzle.situations.length > 0) {
      this.currentSituation = this.puzzle.situations[0];
      this.initializeBoard(this.currentSituation.fenPosition);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.authSubscription?.unsubscribe();
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

  startArenaMode(): void {
    this.gameState = 'playing';
    this.startTimer();
  }

  startTimer(): void {
    if (this.timer) clearInterval(this.timer);
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
        this.handleMove(this.selectedSquare, square);
      }
    } else if (square.piece) {
      square.isSelected = true;
      this.selectedSquare = square;
    }
  }

  handleMove(from: ChessSquare, to: ChessSquare): void {
    const moveStr = `${from.id}${to.id}`;
    const expectedMoves = this.currentSituation?.solutionMoves.split(',') || [];

    // Simulate move
    to.piece = from.piece;
    from.piece = null;
    from.isSelected = false;
    this.selectedSquare = null;
    this.moveHistory.push(moveStr);

    this.board.forEach(r => r.forEach(s => s.isLastMove = false));
    from.isLastMove = true;
    to.isLastMove = true;

    if (this.moveHistory.length >= expectedMoves.length) {
      this.completeSituation(true);
    }
  }

  completeSituation(success: boolean): void {
    if (success) {
      this.gameState = 'success';
    } else {
      this.gameState = 'failure';
    }
  }

  nextSituation(): void {
    this.currentSituationIndex++;
    if (this.puzzle.situations && this.currentSituationIndex < this.puzzle.situations.length) {
      this.currentSituation = this.puzzle.situations[this.currentSituationIndex];
      this.moveHistory = [];
      this.initializeBoard(this.currentSituation.fenPosition);
      this.gameState = 'playing';
    } else {
      this.gameState = 'finished';
      this.completed.emit();
    }
  }

  close(): void {
    this.closed.emit();
  }

  get progressPercentage(): number {
    if (!this.puzzle.situations || this.puzzle.situations.length === 0) return 0;
    if (this.gameState === 'finished') return 100;
    return (this.currentSituationIndex / this.puzzle.situations.length) * 100;
  }
}

