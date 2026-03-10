import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
    private toastService = inject(ToastService);
    private subscription!: Subscription;

    toasts: Toast[] = [];

    ngOnInit() {
        console.log('ToastComponent Initialized!');
        this.subscription = this.toastService.toasts$.subscribe(toast => {
            console.log('Toast received:', toast);
            this.toasts.push(toast);

            // Auto-dismiss after 4 seconds
            setTimeout(() => this.remove(toast.id), 4000);
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    remove(id: number) {
        this.toasts = this.toasts.filter(t => t.id !== id);
    }

    getIcon(type: string): string {
        switch (type) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            case 'info': return 'info';
            default: return 'info';
        }
    }
}
