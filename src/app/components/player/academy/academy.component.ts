import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModuleService } from '../../../core/services/module.service';
import { Module } from '../../../core/models/module.model';
import { QuizService } from '../../../core/services/quiz.service';
import { Quiz } from '../../../core/models/quiz.model';
import { UserQuizService } from '../../../core/services/user-quiz.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ActiveQuizComponent } from '../active-quiz/active-quiz.component';

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, RouterModule, ActiveQuizComponent],
  templateUrl: './academy.component.html',
  styleUrl: './academy.component.css'
})
export class AcademyComponent implements OnInit {
  private quizService = inject(QuizService);
  private userQuizService = inject(UserQuizService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private moduleService = inject(ModuleService);

  quizzes: any[] = [];
  user: any = null;
  loading = true;
  selectedQuiz: Quiz | null = null;

  ngOnInit(): void {
    this.authService.currentUser.subscribe(currUser => {
      if (currUser && currUser.id) {
        this.loadAcademyData(currUser.id);
      }
    });
  }

  private loadAcademyData(userId: number): void {
    this.loading = true;
    forkJoin({
      quizzes: this.quizService.getAll().pipe(catchError(() => of([]))),
      userQuizProgress: this.userQuizService.getUserQuiz(userId).pipe(catchError(() => of([]))),
      user: this.userService.getById(userId).pipe(catchError(() => of(null))),
      modules: this.moduleService.getAll().pipe(catchError(() => of([])))
    }).subscribe(({ quizzes, userQuizProgress, user, modules }) => {
      this.user = user;

      this.quizzes = quizzes.map((q) => {
        const progress = userQuizProgress.find(p => p.quizId === q.id);
        const module = modules.find(m => m.id === q.moduleId);
        const totalXp = q.questions.reduce((sum: number, question: any) => sum + (question.xpReward || 0), 0);
        return {
          ...q,
          level: q.difficulty === 1 ? 'BEGINNER' : (q.difficulty === 2 ? 'INTERMEDIATE' : 'ADVANCED'),
          moduleTitle: module ? module.name : 'Basic Module',
          xpReward: totalXp,
          score: progress?.score || 0,
          image: q.imageUrl || 'assets/images/quiz-placeholder.jpg',
          completed: progress?.completed || false
        };
      });

      this.loading = false;
    });
  }

  startQuiz(quiz: Quiz): void {
    this.selectedQuiz = quiz;
  }

  onQuizCompleted(results: any[]): void {
    if (!this.user || !this.selectedQuiz) return;

    const quizId = this.selectedQuiz.id;
    const userId = this.user.id;

    // Check if progress exists, if not create it, then update
    this.userQuizService.getUserQuiz(userId).subscribe(userQuizzes => {
        let progress = userQuizzes.find(p => p.quizId === quizId);
        
        const updateLogic = (progId: number) => {
            const updateDto = {
                answers: results.map(r => ({
                    questionId: r.questionId,
                    selectedOptionId: r.selectedOptionId
                }))
            };
            this.userQuizService.updateProgress(progId, updateDto).subscribe(() => {
                this.selectedQuiz = null;
                this.loadAcademyData(userId);
            });
        };

        if (!progress) {
            this.userQuizService.startQuiz({ userId, quizId }).subscribe(newProg => {
                updateLogic(newProg.id);
            });
        } else {
            updateLogic(progress.id);
        }
    });
  }

  closeQuiz(): void {
    this.selectedQuiz = null;
  }
}
