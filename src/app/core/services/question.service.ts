import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, QuestionCreateDTO, QuestionUpdateDTO } from '../models/question.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/questions`;

    getQuestionsByQuizId(quizId: number): Observable<Question[]> {
        return this.http.get<Question[]>(`${this.apiUrl}/quiz/${quizId}`);
    }

    createQuestion(dto: QuestionCreateDTO): Observable<Question> {
        return this.http.post<Question>(this.apiUrl, dto);
    }

    updateQuestion(id: number, dto: QuestionUpdateDTO): Observable<Question> {
        return this.http.put<Question>(`${this.apiUrl}/${id}`, dto);
    }

    deleteQuestion(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
