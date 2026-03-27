import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserCreateDTO, UserUpdateDTO } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/users`;

    getAll(params: {
        page?: number;
        size?: number;
        search?: string;
        role?: string;
        sort?: string;
    } = {}): Observable<import('../models/user.model').PaginatedResponse<User>> {
        let queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.set('page', params.page.toString());
        if (params.size !== undefined) queryParams.set('size', params.size.toString());
        if (params.search) queryParams.set('search', params.search);
        if (params.role) queryParams.set('role', params.role);
        if (params.sort) queryParams.set('sort', params.sort);

        const url = queryParams.toString() ? `${this.apiUrl}?${queryParams.toString()}` : this.apiUrl;
        return this.http.get<import('../models/user.model').PaginatedResponse<User>>(url);
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
