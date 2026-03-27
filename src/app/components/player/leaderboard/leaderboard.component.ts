import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../../../core/services/leaderboard.service';
import { LeaderboardPlayer, Period } from '../../../core/models/leaderboard.model';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { ChessLoaderComponent } from '../../../shared/components/chess-loader/chess-loader.component';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ChessLoaderComponent],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  private leaderboardService = inject(LeaderboardService);
  private authService = inject(AuthService);

  players: LeaderboardPlayer[] = [];
  podiumPlayers: LeaderboardPlayer[] = [];
  tablePlayers: LeaderboardPlayer[] = [];
  currentUserId: number = 0;

  selectedPeriod: Period = Period.ALL_TIME;
  periods = Period;
  loading = true;
  hasError = false;

  ngOnInit(): void {
    this.currentUserId = this.authService.currentUserValue?.id;
    this.loadLeaderboard(Period.ALL_TIME);
  }

  loadLeaderboard(period: Period): void {
    this.selectedPeriod = period;
    this.loading = true;
    this.hasError = false;

    this.leaderboardService.getLeaderboard(period).subscribe({
      next: (players) => {
        this.players = players;

        // Build podium (top 3 in order: 2nd, 1st, 3rd for visual layout)
        const top3 = this.players.slice(0, 3);
        this.podiumPlayers = [];
        if (top3[1]) this.podiumPlayers.push(top3[1]); // 2nd
        if (top3[0]) this.podiumPlayers.push(top3[0]); // 1st
        if (top3[2]) this.podiumPlayers.push(top3[2]); // 3rd

        this.tablePlayers = this.players.slice(3);
        this.loading = false;
      },
      error: () => {
        this.hasError = true;
        this.loading = false;
      }
    });
  }

  switchPeriod(period: Period): void {
    if (this.selectedPeriod !== period) {
      this.loadLeaderboard(period);
    }
  }

  getAvatar(player: LeaderboardPlayer): string {
    return player.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`;
  }

  isCurrentUser(player: LeaderboardPlayer): boolean {
    return player.userId === this.currentUserId;
  }

  getLeague(xp: number): string {
    if (xp > 15000) return 'Emerald';
    if (xp > 10000) return 'Diamond';
    if (xp > 5000) return 'Gold';
    if (xp > 2000) return 'Silver';
    return 'Bronze';
  }
}
