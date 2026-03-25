import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz, QuizCreateDTO, QuizUpdateDTO } from '../models/quiz.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class QuizService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/quizzes`;

    getAll(): Observable<Quiz[]> {
        return this.http.get<Quiz[]>(this.apiUrl);
    }

    getById(id: number): Observable<Quiz> {
        return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
    }

    getByModuleId(moduleId: number): Observable<Quiz[]> {
        return this.http.get<Quiz[]>(`${this.apiUrl}/module/${moduleId}`);
    }

    create(dto: QuizCreateDTO): Observable<Quiz> {
        return this.http.post<Quiz>(this.apiUrl, dto);
    }

    update(id: number, dto: QuizUpdateDTO): Observable<Quiz> {
        return this.http.put<Quiz>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
