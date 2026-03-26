import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Puzzle, Situation } from '../../../core/models/puzzle.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserSituationService } from '../../../core/services/user-situation.service';

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
  lastUserMove: string = ''; // Tracks the single move allowed
  
  lives = 5;
  canContinue = false;
  
  currentUserImageUrl: string = 'assets/images/characters/regalis-avatar.png';
  private authSubscription?: Subscription;
  private userSituationService = inject(UserSituationService);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      if (user && user.imageUrl) this.currentUserImageUrl = user.imageUrl;
    });

    if (this.puzzle?.situations && this.puzzle.situations.length > 0) {
      this.loadSituation(0);
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  loadSituation(index: number): void {
    if (!this.puzzle?.situations) return;
    this.currentSituationIndex = index;
    this.currentSituation = this.puzzle.situations[index];
    this.initializeBoard(this.currentSituation.fenPosition);
    this.canContinue = false;

    // Notify backend "opened"
    const userId = this.authService.currentUserValue?.id;
    if (userId && this.currentSituation.id) {
        this.userSituationService.openSituation(userId, this.currentSituation.id).subscribe();
    }
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
          row.push(this.createSquare(i, fileIndex, this.getPieceFromChar(char)));
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
      rank, file, piece,
      color: (rank + file) % 2 === 0 ? 'light' : 'dark',
      isSelected: false, isHint: false, isLastMove: false
    };
  }

  getPieceFromChar(char: string): string {
    const color = char === char.toUpperCase() ? 'w' : 'b';
    return `${color}${char.toUpperCase()}`;
  }

  startArenaMode(): void {
    this.gameState = 'playing';
  }

  onSquareClick(square: ChessSquare): void {
    if (this.gameState !== 'playing') return;

    if (this.selectedSquare) {
      if (this.selectedSquare === square) {
        this.selectedSquare.isSelected = false;
        this.selectedSquare = null;
      } else {
        this.makeMove(this.selectedSquare, square);
      }
    } else if (square.piece) {
      square.isSelected = true;
      this.selectedSquare = square;
    }
  }

  makeMove(from: ChessSquare, to: ChessSquare): void {
    // Before moving, reset if they already moved
    if (this.lastUserMove && this.currentSituation) {
        this.initializeBoard(this.currentSituation.fenPosition);
        // Find 'from' and 'to' again in the new board
        from = this.findSquareById(from.id);
        to = this.findSquareById(to.id);
    }

    // Basic chess move simulation
    to.piece = from.piece;
    from.piece = null;
    from.isSelected = false;
    this.selectedSquare = null;
    
    this.board.forEach(r => r.forEach(s => s.isLastMove = false));
    from.isLastMove = true;
    to.isLastMove = true;
    
    this.lastUserMove = `${from.id}${to.id}`;
    this.canContinue = true; // Enabled "CHECK" button
  }

  private findSquareById(id: string): ChessSquare {
      for (let row of this.board) {
          for (let s of row) {
              if (s.id === id) return s;
          }
      }
      return this.board[0][0]; // Should never happen
  }

  checkResult(): void {
      if (!this.currentSituation || !this.lastUserMove) return;

      const userId = this.authService.currentUserValue?.id;
      if (userId && this.currentSituation.id) {
          this.userSituationService.completeSituation(userId, this.currentSituation.id, this.lastUserMove).subscribe({
              next: (res) => {
                  if (res.isCorrect) {
                      this.gameState = 'success';
                  } else {
                      this.lives--;
                      this.gameState = 'failure';
                      if (this.lives <= 0) {
                          // Handle game over logic
                      }
                  }
              },
              error: (err) => {
                  console.error('Error completing situation', err);
                  this.gameState = 'failure';
              }
          });
      }
  }

  validatePosition(): boolean {
      // Use the direct check in checkResult instead
      return this.lastUserMove === this.currentSituation?.solutionMoves;
  }

  generateCurrentFen(): string {
      // Placeholder for FEN generation logic
      return "";
  }

  retry(): void {
      if (this.currentSituation) {
          this.initializeBoard(this.currentSituation.fenPosition);
          this.gameState = 'playing';
          this.canContinue = false;
          this.lastUserMove = '';
      }
  }

  nextSituation(): void {
    const nextIndex = this.currentSituationIndex + 1;
    if (this.puzzle.situations && nextIndex < this.puzzle.situations.length) {
      this.loadSituation(nextIndex);
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
    const base = (this.currentSituationIndex / this.puzzle.situations.length) * 100;
    if (this.gameState === 'success' || this.gameState === 'finished') {
        return ((this.currentSituationIndex + 1) / this.puzzle.situations.length) * 100;
    }
    return base;
  }
}

