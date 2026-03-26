import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserSituation {
  id?: number;
  userId: number;
  situationId: number;
  status: 'OPENED' | 'COMPLETED';
}

@Injectable({
  providedIn: 'root'
})
export class UserSituationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/user-situations`;

  openSituation(userId: number, situationId: number): Observable<UserSituation> {
    return this.http.post<UserSituation>(`${this.apiUrl}/${userId}/open/${situationId}`, {});
  }

  completeSituation(userId: number, situationId: number): Observable<UserSituation> {
    return this.http.post<UserSituation>(`${this.apiUrl}/${userId}/complete/${situationId}`, {});
  }
}
