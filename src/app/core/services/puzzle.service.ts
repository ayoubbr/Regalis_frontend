import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Puzzle, PuzzleCreateDTO, PuzzleUpdateDTO } from '../models/puzzle.model';

@Injectable({
    providedIn: 'root'
})
export class PuzzleService {
    private http = inject(HttpClient);
    private apiUrl = '/api/puzzles';

    getById(id: number): Observable<Puzzle> {
        return this.http.get<Puzzle>(`${this.apiUrl}/${id}`);
    }

    getByModuleId(moduleId: number): Observable<Puzzle[]> {
        return this.http.get<Puzzle[]>(`${this.apiUrl}/module/${moduleId}`);
    }

    create(dto: PuzzleCreateDTO): Observable<Puzzle> {
        return this.http.post<Puzzle>(this.apiUrl, dto);
    }

    update(id: number, dto: PuzzleUpdateDTO): Observable<Puzzle> {
        return this.http.put<Puzzle>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    verifySolution(id: number, moves: { [key: string]: string }): Observable<{ correct: boolean }> {
        return this.http.post<{ correct: boolean }>(`${this.apiUrl}/${id}/verify`, moves);
    }
}
