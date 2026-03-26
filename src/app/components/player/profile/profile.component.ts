import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { AchievementService } from '../../../core/services/achievement.service';
import { User } from '../../../core/models/user.model';
import { Achievement, UserAchievement } from '../../../core/models/achievement.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private achievementService = inject(AchievementService);

  private authService = inject(AuthService);
  
  currentUser: any = null;
  achievements: (Achievement & { unlocked?: boolean, unlockedDate?: string })[] = [];
  recentActivity: any[] = [];
  
  loading = true;

  ngOnInit(): void {
    this.authService.currentUser.subscribe(currUser => {
      if (currUser && currUser.id) {
        this.loadUserData(currUser.id);
      }
    });
  }

  private loadUserData(userId: number): void {
    this.loading = true;
    forkJoin({
      allAchievements: this.achievementService.getAll().pipe(catchError(() => of([]))),
      userAchievements: this.achievementService.getUserAchievements(userId).pipe(catchError(() => of([])))
    }).subscribe(({ allAchievements, userAchievements }) => {
      // Use the global current user value from authService
      this.currentUser = this.authService.currentUserValue;
      
      // Merge achievements with user status
      this.achievements = allAchievements.map(ach => {
        const userAch = userAchievements.find(ua => ua.achievementId === ach.id);
        return {
          ...ach,
          unlocked: !!userAch,
          unlockedDate: userAch?.unlockedDate
        };
      });

      // Simulated activities (could also be fetched if there was an endpoint)
      this.recentActivity = [
        {
          type: 'milestone',
          title: `Reached Level ${this.currentUser?.level || 1}`,
          time: 'Recently',
          meta: 'Level Up',
          xp: '+0 XP',
          icon: 'trending_up',
          iconColor: '#855ef7'
        },
        {
          type: 'streak',
          title: `${this.currentUser?.currentStreak || 0} Day Streak!`,
          time: 'Today',
          meta: 'Daily Focus',
          xp: '+50 XP',
          icon: 'local_fire_department',
          iconColor: '#ff9800'
        }
      ];

      this.loading = false;
    });
  }

  getXpProgress(): number {
    if (!this.currentUser) return 0;
    return (this.currentUser.totalXp % 100);
  }

  getRank(): string {
    if (!this.currentUser) return 'Beginner';
    if (this.currentUser.totalXp > 1000) return 'Grandmaster';
    if (this.currentUser.totalXp > 500) return 'Master';
    return 'Chess Apprentice';
  }
}
