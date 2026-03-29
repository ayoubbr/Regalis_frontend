import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz, QuizCreateDTO, QuizUpdateDTO } from '../models/quiz.model';
import { PaginatedResponse } from '../models/user.model';
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

    getPagedQuizzes(params: {
        page?: number,
        size?: number,
        search?: string,
        moduleId?: string,
        sort?: string
    } = {}): Observable<PaginatedResponse<Quiz>> {
        let httpParams = new HttpParams();
        
        if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
        if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
        if (params.search) httpParams = httpParams.set('search', params.search);
        if (params.moduleId) httpParams = httpParams.set('moduleId', params.moduleId);
        if (params.sort) httpParams = httpParams.set('sort', params.sort);

        const url = `${this.apiUrl}/paged`;
        return this.http.get<PaginatedResponse<Quiz>>(url, { params: httpParams });
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
