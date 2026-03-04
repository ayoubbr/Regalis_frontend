import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProgress, UserProgressCreateDTO, UserProgressUpdateDTO } from '../models/user-progress.model';

@Injectable({
    providedIn: 'root'
})
export class UserProgressService {
    private http = inject(HttpClient);
    private apiUrl = '/api/progress';

    startLesson(dto: UserProgressCreateDTO): Observable<UserProgress> {
        return this.http.post<UserProgress>(this.apiUrl, dto);
    }

    updateProgress(id: number, dto: UserProgressUpdateDTO): Observable<UserProgress> {
        return this.http.put<UserProgress>(`${this.apiUrl}/${id}`, dto);
    }

    getUserProgress(userId: number): Observable<UserProgress[]> {
        return this.http.get<UserProgress[]>(`${this.apiUrl}/user/${userId}`);
    }

    getProgressByLesson(userId: number, lessonId: number): Observable<UserProgress> {
        return this.http.get<UserProgress>(`${this.apiUrl}/user/${userId}/lesson/${lessonId}`);
    }
}
