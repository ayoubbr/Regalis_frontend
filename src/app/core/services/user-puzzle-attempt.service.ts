import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserPuzzleAttempt, UserPuzzleAttemptCreateDTO } from '../models/user-puzzle-attempt.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserPuzzleAttemptService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/user-puzzle-attempts`;

    recordAttempt(dto: UserPuzzleAttemptCreateDTO): Observable<UserPuzzleAttempt> {
        return this.http.post<UserPuzzleAttempt>(this.apiUrl, dto);
    }

    getUserAttempts(userId: number): Observable<UserPuzzleAttempt[]> {
        return this.http.get<UserPuzzleAttempt[]>(`${this.apiUrl}/user/${userId}`);
    }
}
