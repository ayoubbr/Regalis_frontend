import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserQuiz, UserQuizCreateDTO, UserQuizUpdateDTO } from '../models/user-quiz.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserQuizService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/progress`;

    startQuiz(dto: UserQuizCreateDTO): Observable<UserQuiz> {
        return this.http.post<UserQuiz>(this.apiUrl, dto);
    }

    updateProgress(id: number, dto: UserQuizUpdateDTO): Observable<UserQuiz> {
        return this.http.put<UserQuiz>(`${this.apiUrl}/${id}`, dto);
    }

    getUserQuiz(userId: number): Observable<UserQuiz[]> {
        return this.http.get<UserQuiz[]>(`${this.apiUrl}/user/${userId}`);
    }

    getProgressByQuiz(userId: number, quizId: number): Observable<UserQuiz> {
        return this.http.get<UserQuiz>(`${this.apiUrl}/user/${userId}/quiz/${quizId}`);
    }
}
