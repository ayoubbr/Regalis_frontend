import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Puzzle, PuzzleCreateDTO, PuzzleUpdateDTO } from '../models/puzzle.model';
import { PaginatedResponse } from '../models/user.model';
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

    getPagedPuzzles(params: {
        page?: number,
        size?: number,
        search?: string,
        moduleId?: string,
        sort?: string
    } = {}): Observable<PaginatedResponse<Puzzle>> {
        let httpParams = new HttpParams();
        
        if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
        if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
        if (params.search) httpParams = httpParams.set('search', params.search);
        if (params.moduleId) httpParams = httpParams.set('moduleId', params.moduleId);
        if (params.sort) httpParams = httpParams.set('sort', params.sort);

        const url = `${this.apiUrl}/paged`;
        return this.http.get<PaginatedResponse<Puzzle>>(url, { params: httpParams });
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
