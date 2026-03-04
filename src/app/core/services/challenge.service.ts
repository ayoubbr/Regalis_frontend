import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Challenge, ChallengeCreateDTO, ChallengeUpdateDTO } from '../models/challenge.model';

@Injectable({
    providedIn: 'root'
})
export class ChallengeService {
    private http = inject(HttpClient);
    private apiUrl = '/api/challenges';

    getById(id: number): Observable<Challenge> {
        return this.http.get<Challenge>(`${this.apiUrl}/${id}`);
    }

    getChallengesForUser(userId: number): Observable<Challenge[]> {
        return this.http.get<Challenge[]>(`${this.apiUrl}/user/${userId}`);
    }

    create(dto: ChallengeCreateDTO): Observable<Challenge> {
        return this.http.post<Challenge>(this.apiUrl, dto);
    }

    update(id: number, dto: ChallengeUpdateDTO): Observable<Challenge> {
        return this.http.put<Challenge>(`${this.apiUrl}/${id}`, dto);
    }
}
