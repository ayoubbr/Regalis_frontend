import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyChallenge, DailyChallengeCreateDTO, DailyChallengeUpdateDTO } from '../models/daily-challenge.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DailyChallengeService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/daily-challenges`;

    getTodayChallenge(userId: number): Observable<DailyChallenge> {
        return this.http.get<DailyChallenge>(`${this.apiUrl}/user/${userId}/today`);
    }

    getChallengeByDate(userId: number, date: string): Observable<DailyChallenge> {
        return this.http.get<DailyChallenge>(`${this.apiUrl}/user/${userId}/date/${date}`);
    }

    getChallengeHistory(userId: number): Observable<DailyChallenge[]> {
        return this.http.get<DailyChallenge[]>(`${this.apiUrl}/user/${userId}/history`);
    }

    getAll(): Observable<DailyChallenge[]> {
        return this.http.get<DailyChallenge[]>(this.apiUrl);
    }

    create(dto: DailyChallengeCreateDTO): Observable<DailyChallenge> {
        return this.http.post<DailyChallenge>(this.apiUrl, dto);
    }

    complete(id: number, dto: DailyChallengeUpdateDTO): Observable<DailyChallenge> {
        return this.http.put<DailyChallenge>(`${this.apiUrl}/${id}/complete`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
