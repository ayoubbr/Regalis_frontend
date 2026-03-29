import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../../../core/services/leaderboard.service';
import { LeaderboardPlayer, Period } from '../../../core/models/leaderboard.model';
import { ChessLoaderComponent } from '../../../shared/components/chess-loader/chess-loader.component';

@Component({
  selector: 'app-admin-leaderboard',
  standalone: true,
  imports: [CommonModule, ChessLoaderComponent],
  templateUrl: './admin-leaderboard.component.html',
  styleUrl: './admin-leaderboard.component.css'
})
export class AdminLeaderboardComponent implements OnInit {
  private leaderboardService = inject(LeaderboardService);

  players: LeaderboardPlayer[] = [];
  selectedPeriod: Period = Period.ALL_TIME;
  periods = Period;
  loading = true;
  hasError = false;

  ngOnInit(): void {
    this.loadLeaderboard(Period.ALL_TIME);
  }

  loadLeaderboard(period: Period): void {
    this.selectedPeriod = period;
    this.loading = true;
    this.hasError = false;

    this.leaderboardService.getLeaderboard(period).subscribe({
      next: (players) => {
        this.players = players;
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

  getRankClass(rank: number): string {
    if (rank === 1) return 'rank-first';
    if (rank === 2) return 'rank-second';
    if (rank === 3) return 'rank-third';
    return '';
  }

  getRankIcon(rank: number): string {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank.toString();
  }
}
