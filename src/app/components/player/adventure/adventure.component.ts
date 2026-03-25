import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleService } from '../../../core/services/module.service';
import { Module } from '../../../core/models/module.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserPuzzleService } from '../../../core/services/user-puzzle.service';
import { PuzzleService } from '../../../core/services/puzzle.service';
import { forkJoin } from 'rxjs';

import { RouterModule } from '@angular/router';
import { Quiz } from '../../../core/models/quiz.model';
import { Puzzle } from '../../../core/models/puzzle.model';
import { ActiveQuizComponent } from '../active-quiz/active-quiz.component';
import { ActiveSituationComponent } from '../active-situation/active-situation.component';

@Component({
  selector: 'app-adventure',
  standalone: true,
  imports: [CommonModule, RouterModule, ActiveQuizComponent, ActiveSituationComponent],
  templateUrl: './adventure.component.html',
  styleUrl: './adventure.component.css'
})
export class AdventureComponent implements OnInit {
  modules: any[] = [];
  roadPath: string = '';
  loading = true;
  selectedQuiz: Quiz | null = null;
  selectedPuzzle: Puzzle | null = null;
  
  constructor(
    private moduleService: ModuleService,
    private puzzleService: PuzzleService,
    public authService: AuthService,
    private userPuzzleService: UserPuzzleService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user && user.id) {
        this.loadAdventure(user.id);
      }
    });
  }

  loadAdventure(userId: number): void {
    this.loading = true;
    forkJoin({
      allModules: this.moduleService.getAll(),
      allPuzzles: this.puzzleService.getAll(),
      userPuzzles: this.userPuzzleService.getUserAttempts(userId)
    }).subscribe(({ allModules, allPuzzles, userPuzzles }) => {
      const sortedModules = allModules.sort((a, b) => a.orderIndex - b.orderIndex);
      
      let foundActive = false;

      this.modules = sortedModules.map((mod, index) => {
        const modPuzzles = allPuzzles.filter(p => p.moduleId === mod.id);
        
        const mappedPuzzles = modPuzzles.map((puzzle, puzzleIndex) => {
            const isCompleted = userPuzzles.some(p => p.puzzleId === puzzle.id && p.solved);
            
            let status = 'locked';
            if (isCompleted) {
              status = 'completed';
            } else if (!foundActive) {
              status = 'active';
              foundActive = true;
            }

            return {
              ...puzzle,
              status: status,
              label: `Puzzle ${puzzleIndex + 1}`
            };
        });

        return {
          ...mod,
          puzzles: mappedPuzzles
        };
      });

      this.loading = false;
    });
  }

  getNodeOffset(index: number): number {
    // Return a horizontal offset in pixels to create a wavy effect
    // Alternates: 0, 50, 80, 50, 0, -50, -80, -50...
    const offsets = [0, 45, 75, 45, 0, -45, -75, -45];
    return offsets[index % offsets.length];
  }

  getNodeIcon(status: string, index: number): string {
      if (status === 'completed') return 'check_circle';
      if (status === 'active') return 'star';
      if (index % 5 === 4) return 'trophy';
      return 'lock';
  }

  startPuzzle(puzzle: any): void {
      if (puzzle.status === 'locked') return;
      this.selectedPuzzle = puzzle;
  }

  closePuzzle(): void {
      this.selectedPuzzle = null;
  }

  onPuzzleCompleted(): void {
      // Refresh or handle completion
      this.authService.currentUser.subscribe(user => {
          if (user && user.id) {
              this.loadAdventure(user.id);
          }
      });
  }
}
