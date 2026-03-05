import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lesson, LessonCreateDTO, LessonUpdateDTO } from '../models/lesson.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LessonService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/lessons`;

    getAll(): Observable<Lesson[]> {
        return this.http.get<Lesson[]>(this.apiUrl);
    }

    getById(id: number): Observable<Lesson> {
        return this.http.get<Lesson>(`${this.apiUrl}/${id}`);
    }

    getByModuleId(moduleId: number): Observable<Lesson[]> {
        return this.http.get<Lesson[]>(`${this.apiUrl}/module/${moduleId}`);
    }

    create(dto: LessonCreateDTO): Observable<Lesson> {
        return this.http.post<Lesson>(this.apiUrl, dto);
    }

    update(id: number, dto: LessonUpdateDTO): Observable<Lesson> {
        return this.http.put<Lesson>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
