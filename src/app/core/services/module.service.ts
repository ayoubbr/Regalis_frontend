import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Module, ModuleCreateDTO, ModuleUpdateDTO } from '../models/module.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ModuleService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/modules`;

    getAll(): Observable<Module[]> {
        return this.http.get<Module[]>(this.apiUrl);
    }

    getById(id: number): Observable<Module> {
        return this.http.get<Module>(`${this.apiUrl}/${id}`);
    }

    create(dto: ModuleCreateDTO): Observable<Module> {
        return this.http.post<Module>(this.apiUrl, dto);
    }

    update(id: number, dto: ModuleUpdateDTO): Observable<Module> {
        return this.http.put<Module>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
