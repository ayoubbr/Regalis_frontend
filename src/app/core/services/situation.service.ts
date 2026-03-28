import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Situation } from '../models/puzzle.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SituationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/situations`;

  getByPuzzleId(puzzleId: number): Observable<Situation[]> {
    return this.http.get<Situation[]>(`${this.apiUrl}/puzzle/${puzzleId}`);
  }

  create(situation: any): Observable<Situation> {
    return this.http.post<Situation>(this.apiUrl, situation);
  }

  update(id: number, situation: any): Observable<Situation> {
    return this.http.put<Situation>(`${this.apiUrl}/${id}`, situation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
