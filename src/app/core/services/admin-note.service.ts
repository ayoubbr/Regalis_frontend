import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminNote, AdminNoteCreateDTO } from '../models/admin-note.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminNoteService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/admin/notes`;

    createNote(dto: AdminNoteCreateDTO): Observable<AdminNote> {
        return this.http.post<AdminNote>(this.apiUrl, dto);
    }

    getNotesForUser(userId: number): Observable<AdminNote[]> {
        return this.http.get<AdminNote[]>(`${this.apiUrl}/user/${userId}`);
    }

    getAllNotes(): Observable<AdminNote[]> {
        return this.http.get<AdminNote[]>(this.apiUrl);
    }
}
