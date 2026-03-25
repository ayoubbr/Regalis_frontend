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
      user: this.userService.getById(userId).pipe(catchError(() => of(null)))
    }).subscribe(({ quizzes, userQuizProgress, user }) => {
      this.user = user;

      // Mock data enhancement for the "Academy" view based on design
      const quizEnhancements = [
        { level: 'BEGINNER', duration: '5 mins', 
          image: 'https://images.unsplash.com/photo-1587888191477-e74ac6bc9c4b?q=80&w=1214&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { level: 'INTERMEDIATE', duration: '8 mins', 
          image: 'https://images.unsplash.com/photo-1619163413327-546fdb903195?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { level: 'ADVANCED', duration: '12 mins', 
          image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=600&auto=format&fit=crop' },
        { level: 'TIMED', duration: '3 mins', 
          image: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=1258&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
      ];

      this.quizzes = quizzes.map((q, index) => {
        const enhancement = quizEnhancements[index % quizEnhancements.length];
        const progress = userQuizProgress.find(p => p.quizId === q.id);
        return {
          ...q,
          level: enhancement.level,
          duration: enhancement.duration,
          image: q.imageUrl || enhancement.image,
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
    console.log('Quiz completed:', results);
    // Here logic to save results to backend via UserQuizService
    this.selectedQuiz = null;
    if (this.user) {
        this.loadAcademyData(this.user.id); // Refresh data
    }
  }

  closeQuiz(): void {
    this.selectedQuiz = null;
  }
}
