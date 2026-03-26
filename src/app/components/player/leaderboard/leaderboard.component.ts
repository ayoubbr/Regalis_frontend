import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../../../core/services/leaderboard.service';
import { UserService } from '../../../core/services/user.service';
import { LeaderboardEntry, Period } from '../../../core/models/leaderboard.model';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { forkJoin, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RouterLink } from "@angular/router";
import { ChessLoaderComponent } from '../../../shared/components/chess-loader/chess-loader.component';

interface EnrichedLeaderboardEntry extends LeaderboardEntry {
  username: string;
  league: string;
  avatar: string;
  title: string;
  wins: number;
  losses: number;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ChessLoaderComponent],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  private leaderboardService = inject(LeaderboardService);
  private userService = inject(UserService);

  private authService = inject(AuthService);

  leaderboard: EnrichedLeaderboardEntry[] = [];
  podiumPlayers: EnrichedLeaderboardEntry[] = [];
  remainingPlayers: EnrichedLeaderboardEntry[] = [];
  currentUserEntry: EnrichedLeaderboardEntry | null = null;
  
  selectedPeriod: Period = Period.WEEKLY;
  periods = Period;
  loading = true;

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(period: Period = Period.WEEKLY): void {
    this.selectedPeriod = period;
    this.loading = true;
    
    const currentUserId = this.authService.currentUserValue.id;

    forkJoin({
      entries: this.leaderboardService.getLeaderboard(period).pipe(catchError(() => of([]))),
      users: this.userService.getAll().pipe(catchError(() => of([])))
    }).pipe(
      map(({ entries, users }) => {
        // Simulation: If no entries from backend, use mock data
        let finalEntries = entries;
        if (finalEntries.length === 0) {
          finalEntries = [
            { id: 1, period: period, xp: 18940, rank: 1, userId: 1 },
            { id: 2, period: period, xp: 14205, rank: 2, userId: 2 },
            { id: 3, period: period, xp: 12110, rank: 3, userId: 3 },
            { id: 4, period: period, xp: 9820, rank: 4, userId: 4 },
            { id: 5, period: period, xp: 8450, rank: 5, userId: 5 },
            { id: 6, period: period, xp: 7100, rank: 6, userId: currentUserId },
          ];
        }

        const mockUsernames = ['KingRegalis', 'Alex_G', 'Sarah.Sun', 'Leo_The_Great', 'Mia_Codes', 'ExpertPlayer'];

        return finalEntries.map((entry, index) => {
          const user = users.find(u => u.id === entry.userId);
          const league = this.calculateLeague(entry.xp);
          return {
            ...entry,
            username: user ? user.username : (mockUsernames[index] || `Player_${entry.userId}`),
            league: league,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || mockUsernames[index] || entry.userId}`,
            title: this.getLeagueTitle(league),
            wins: Math.floor(entry.xp / 100) + 5,
            losses: Math.floor(Math.random() * 20) + 5
          };
        });
      })
    ).subscribe(enrichedEntries => {
      this.leaderboard = enrichedEntries.sort((a, b) => a.rank - b.rank);
      
      const topThree = this.leaderboard.slice(0, 3);
      this.podiumPlayers = [];
      if (topThree[1]) this.podiumPlayers.push(topThree[1]);
      if (topThree[0]) this.podiumPlayers.push(topThree[0]);
      if (topThree[2]) this.podiumPlayers.push(topThree[2]);

      this.remainingPlayers = this.leaderboard.slice(3);
      
      this.currentUserEntry = this.leaderboard.find(e => e.userId === currentUserId) || null;
      this.loading = false;
    });
  }

  calculateLeague(xp: number): string {
    if (xp > 15000) return 'Emerald';
    if (xp > 10000) return 'Diamond';
    if (xp > 5000) return 'Gold';
    if (xp > 2000) return 'Silver';
    return 'Bronze';
  }

  getLeagueTitle(league: string): string {
    switch (league) {
      case 'Emerald': return 'Emerald Master';
      case 'Diamond': return 'Diamond Warrior';
      case 'Gold': return 'Swift Learner';
      case 'Silver': return 'Rising Star';
      default: return 'Bronze Beginner';
    }
  }

  getLeagueBadgeClass(league: string): string {
    switch (league) {
      case 'Emerald': return 'badge-emerald';
      case 'Diamond': return 'badge-diamond';
      case 'Gold': return 'badge-gold';
      case 'Silver': return 'badge-silver';
      default: return 'badge-bronze';
    }
  }

  switchPeriod(period: Period | string): void {
    const p = period as Period;
    if (this.selectedPeriod !== p) {
      this.loadLeaderboard(p);
    }
  }
}
