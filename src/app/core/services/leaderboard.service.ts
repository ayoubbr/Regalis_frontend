import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaderboardPlayer, Period } from '../models/leaderboard.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LeaderboardService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/leaderboard`;

    getLeaderboard(period: Period): Observable<LeaderboardPlayer[]> {
        return this.http.get<LeaderboardPlayer[]>(`${this.apiUrl}/${period}`);
    }
}
