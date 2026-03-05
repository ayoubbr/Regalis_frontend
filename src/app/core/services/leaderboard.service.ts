import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaderboardEntry, Period } from '../models/leaderboard.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LeaderboardService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/leaderboard`;

    getLeaderboard(period: Period): Observable<LeaderboardEntry[]> {
        return this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/${period}`);
    }

    updateLeaderboard(period: Period): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${period}/update`, {});
    }
}
