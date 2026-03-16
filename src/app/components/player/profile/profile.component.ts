import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { AchievementService } from '../../../core/services/achievement.service';
import { User } from '../../../core/models/user.model';
import { Achievement, UserAchievement } from '../../../core/models/achievement.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  user: User | null = null;
  achievements: (Achievement & { unlocked?: boolean, unlockedDate?: string })[] = [];
  recentActivity: any[] = [];
  
  loading = true;

  ngOnInit(): void {
    // For now using ID 1 as placeholder, usually would come from an auth service
    const userId = 1;

    forkJoin({
      user: this.userService.getById(userId).pipe(catchError(() => of(null))),
      allAchievements: this.achievementService.getAll().pipe(catchError(() => of([]))),
      userAchievements: this.achievementService.getUserAchievements(userId).pipe(catchError(() => of([])))
    }).subscribe(({ user, allAchievements, userAchievements }) => {
      this.user = user;
      
      // Merge achievements with user status
      this.achievements = allAchievements.map(ach => {
        const userAch = userAchievements.find(ua => ua.achievementId === ach.id);
        return {
          ...ach,
          unlocked: !!userAch,
          unlockedDate: userAch?.unlockedDate
        };
      });

      // Simulated activities
      this.recentActivity = [
        {
          type: 'match',
          title: "Won against 'ChessNerd99'",
          time: '2 hours ago',
          meta: 'Blitz 3+0',
          xp: '+15 ELO',
          icon: 'add_circle',
          iconColor: '#00e676'
        },
        {
          type: 'achievement',
          title: "Unlocked 'Streak Master' badge",
          time: 'Yesterday',
          meta: 'Milestone',
          xp: '+500 XP',
          icon: 'emoji_events',
          iconColor: '#855ef7'
        },
        {
          type: 'tournament',
          title: "Entered 'Winter Classic 2024'",
          time: '2 days ago',
          meta: 'Tournament',
          xp: 'Registration Confirmed',
          icon: 'calendar_today',
          iconColor: '#2196f3'
        }
      ];

      this.loading = false;
    });
  }

  getXpProgress(): number {
    if (!this.user) return 0;
    // Simple logic: every 1000 XP is a level
    return (this.user.totalXp % 1000) / 10;
  }

  getRank(): string {
    if (!this.user) return 'Beginner';
    if (this.user.totalXp > 10000) return 'Grandmaster';
    if (this.user.totalXp > 5000) return 'Master';
    return 'Chess Apprentice';
  }
}
