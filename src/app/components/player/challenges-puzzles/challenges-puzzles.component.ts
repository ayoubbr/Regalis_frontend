import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChallengeService } from '../../../core/services/challenge.service';
import { DailyChallengeService } from '../../../core/services/daily-challenge.service';
import { UserProgressService } from '../../../core/services/user-progress.service';
import { LessonService } from '../../../core/services/lesson.service';
import { UserService } from '../../../core/services/user.service';
import { Challenge, ChallengeStatus } from '../../../core/models/challenge.model';
import { DailyChallenge } from '../../../core/models/daily-challenge.model';
import { UserProgress } from '../../../core/models/user-progress.model';
import { Lesson } from '../../../core/models/lesson.model';
import { forkJoin, map, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

interface EnrichedDailyChallenge extends DailyChallenge {
  completedPuzzles: number;
  targetPuzzles: number;
}

interface EnrichedChallenge extends Challenge {
  opponentName: string;
  opponentAvatar: string;
}

interface EnrichedLesson extends Lesson {
  progress: number;
}

@Component({
  selector: 'app-challenges-puzzles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './challenges-puzzles.component.html',
  styleUrl: './challenges-puzzles.component.css'
})
export class ChallengesPuzzlesComponent implements OnInit {
  private challengeService = inject(ChallengeService);
  private dailyChallengeService = inject(DailyChallengeService);
  private userProgressService = inject(UserProgressService);
  private lessonService = inject(LessonService);
  private userService = inject(UserService);

  userId = 1; // Assuming current user ID is 1
  todayChallenge: EnrichedDailyChallenge | null = null;
  userChallenges: EnrichedChallenge[] = [];
  inProgressLessons: EnrichedLesson[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    forkJoin({
      daily: this.dailyChallengeService.getTodayChallenge(this.userId).pipe(catchError(() => of(null))),
      challenges: this.challengeService.getAll().pipe(catchError(() => of([]))),
      progress: this.userProgressService.getUserProgress(this.userId).pipe(catchError(() => of([]))),
      users: this.userService.getAll().pipe(catchError(() => of([])))
    }).pipe(
      switchMap(data => {
        const inProgress = data.progress.filter(p => !p.completed);
        if (inProgress.length === 0) return of({ ...data, lessons: [] });
        
        const lessonRequests = inProgress.map(p => this.lessonService.getById(p.lessonId).pipe(
          map(l => ({ ...l, progress: 65 })) // Mocking progress percentage for now
        ));
        
        return forkJoin(lessonRequests).pipe(
          map(lessons => ({ ...data, lessons })),
          catchError(() => of({ ...data, lessons: [] }))
        );
      })
    ).subscribe(data => {
      // 1. Daily Challenge
      if (data.daily) {
        this.todayChallenge = {
          ...data.daily,
          completedPuzzles: data.daily.completed ? 1 : 0,
          targetPuzzles: 1
        } as EnrichedDailyChallenge;
      } else {
        // Mock daily challenge if none exists
        this.todayChallenge = {
          id: 1,
          challengeDate: new Date().toISOString().split('T')[0],
          puzzleId: 101,
          userId: this.userId,
          completed: false,
          targetPuzzles: 3,
          completedPuzzles: 2
        } as EnrichedDailyChallenge;
      }

      // 2. User Challenges
      const filteredChallenges = data.challenges.filter(c => c.challengerId === this.userId || c.opponentId === this.userId);
      this.userChallenges = filteredChallenges.map(c => {
        const opponentId = c.challengerId === this.userId ? c.opponentId : c.challengerId;
        const opponent = data.users.find(u => u.id === opponentId);
        return {
          ...c,
          opponentName: opponent ? opponent.username : `Player_${opponentId}`,
          opponentAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${opponent?.username || opponentId}`
        };
      });

      // Simulation: Add a mock challenge if none found
      if (this.userChallenges.length === 0) {
        this.userChallenges = [{
          id: 99,
          status: ChallengeStatus.PENDING,
          challengerId: 2,
          opponentId: 1,
          puzzleId: 202,
          createdAt: new Date().toISOString(),
          opponentName: 'Sarah.Sun',
          opponentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah.Sun',
          winnerId: null
        }];
      }

      // 3. In-Progress Lessons
      this.inProgressLessons = data.lessons as EnrichedLesson[];
      
      // Simulation: Add mock lessons if none found
      if (this.inProgressLessons.length === 0) {
        this.inProgressLessons = [
          { id: 1, title: 'Mastering the Italian Game', description: 'Learn the core principles of the Italian Opening.', progress: 75 },
          { id: 2, title: 'Endgame: Rook & Pawn', description: 'Essential techniques for converting advantage in endgames.', progress: 40 }
        ] as any;
      }

      this.loading = false;
    });
  }

  getDailyProgressWidth(): string {
    if (!this.todayChallenge) return '0%';
    const progress = (this.todayChallenge.completedPuzzles / this.todayChallenge.targetPuzzles) * 100;
    return `${progress}%`;
  }
}
