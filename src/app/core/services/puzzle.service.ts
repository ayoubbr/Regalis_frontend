import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Puzzle, PuzzleCreateDTO, PuzzleUpdateDTO } from '../models/puzzle.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PuzzleService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/puzzles`;

    getAll(): Observable<Puzzle[]> {
        return this.http.get<Puzzle[]>(this.apiUrl);
    }

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

    verifySolution(puzzleId: number, submittedMoves: string): Observable<boolean> {
        return this.http.post<boolean>(`${this.apiUrl}/${puzzleId}/verify`, { submittedMoves });
    }
}
