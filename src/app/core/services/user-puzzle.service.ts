import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserPuzzle, UserPuzzleCreateDTO } from '../models/user-puzzle.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserPuzzleService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/user-puzzles`;

    recordAttempt(dto: UserPuzzleCreateDTO): Observable<UserPuzzle> {
        return this.http.post<UserPuzzle>(this.apiUrl, dto);
    }

    getUserAttempts(userId: number): Observable<UserPuzzle[]> {
        return this.http.get<UserPuzzle[]>(`${this.apiUrl}/user/${userId}`);
    }
}
