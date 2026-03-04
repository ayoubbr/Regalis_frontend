import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserCreateDTO, UserUpdateDTO } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = '/api/users';

    getAll(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    getByUsername(username: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/username/${username}`);
    }

    create(dto: UserCreateDTO): Observable<User> {
        return this.http.post<User>(this.apiUrl, dto);
    }

    update(id: number, dto: UserUpdateDTO): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
