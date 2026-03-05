import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement, AchievementCreateDTO, AchievementUpdateDTO, UserAchievement } from '../models/achievement.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AchievementService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/achievements`;

    create(dto: AchievementCreateDTO): Observable<Achievement> {
        return this.http.post<Achievement>(this.apiUrl, dto);
    }

    getAll(): Observable<Achievement[]> {
        return this.http.get<Achievement[]>(this.apiUrl);
    }

    update(id: number, dto: AchievementUpdateDTO): Observable<Achievement> {
        return this.http.put<Achievement>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getUserAchievements(userId: number): Observable<UserAchievement[]> {
        return this.http.get<UserAchievement[]>(`${this.apiUrl}/user/${userId}`);
    }

    checkAchievements(userId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/user/${userId}/check`, {});
    }
}
