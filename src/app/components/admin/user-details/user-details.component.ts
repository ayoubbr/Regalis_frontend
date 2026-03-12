import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AchievementService } from '../../../core/services/achievement.service';
import { UserProgressService } from '../../../core/services/user-progress.service';
import { LessonService } from '../../../core/services/lesson.service';
import { User } from '../../../core/models/user.model';
import { Achievement, UserAchievement } from '../../../core/models/achievement.model';
import { UserProgress } from '../../../core/models/user-progress.model';
import { Lesson } from '../../../core/models/lesson.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private achievementService = inject(AchievementService);
  private userProgressService = inject(UserProgressService);
  private lessonService = inject(LessonService);

  userId: number | null = null;
  user: User | null = null;
  unlockedAchievements: (UserAchievement & { details?: Achievement })[] = [];
  allAchievements: Achievement[] = [];
  progress: (UserProgress & { lessonName?: string })[] = [];
  isLoading = true;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;
      this.loadUserDetails();
    }
  }

  loadUserDetails(): void {
    if (!this.userId) return;

    this.isLoading = true;
    
    // We need achievements list to map names/descriptions
    forkJoin({
      user: this.userService.getById(this.userId),
      userAchievements: this.achievementService.getUserAchievements(this.userId),
      allAchievements: this.achievementService.getAll(),
      userProgress: this.userProgressService.getUserProgress(this.userId),
      allLessons: this.lessonService.getAll()
    }).subscribe({
      next: (data) => {
        this.user = data.user;
        this.allAchievements = data.allAchievements;
        
        // Map achievement details
        this.unlockedAchievements = data.userAchievements.map(ua => ({
          ...ua,
          details: this.allAchievements.find(a => a.id === ua.achievementId)
        }));

        // Map lesson names to progress
        this.progress = data.userProgress.map(p => ({
          ...p,
          lessonName: data.allLessons.find(l => l.id === p.lessonId)?.title
        }));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user details', err);
        this.isLoading = false;
      }
    });
  }

  getAchievementStatus(type: string): string {
    switch (type) {
      case 'XP': return 'trending_up';
      case 'STREAK': return 'bolt';
      case 'PUZZLES_SOLVED': return 'extension';
      default: return 'emoji_events';
    }
  }
}
