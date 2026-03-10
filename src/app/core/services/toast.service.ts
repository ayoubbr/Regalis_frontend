import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastSubject = new Subject<Toast>();
    private toastCounter = 0;

    get toasts$(): Observable<Toast> {
        return this.toastSubject.asObservable();
    }

    showSuccess(message: string) {
        this.show(message, 'success');
    }

    showError(message: string) {
        this.show(message, 'error');
    }

    showInfo(message: string) {
        this.show(message, 'info');
    }

    private show(message: string, type: ToastType) {
        this.toastSubject.next({
            id: ++this.toastCounter,
            message,
            type
        });
    }
}
