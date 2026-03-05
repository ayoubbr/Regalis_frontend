import { AdminComponent } from './features/components/admin/admin.component';
import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './features/components/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: 'dashboard',
                component: AdminDashboardComponent
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
