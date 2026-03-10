import { AdminComponent } from './components/admin/admin.component';
import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { LessonsComponent } from './components/admin/lessons/lessons.component';
import { ModulesComponent } from './components/admin/modules/modules.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { ManagePuzzlesComponent } from './components/admin/manage-puzzles/manage-puzzles.component';

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
                path: 'lessons',
                component: LessonsComponent
            },
            {
                path: 'modules',
                component: ModulesComponent
            },
            {
                path: 'users',
                component: UserManagementComponent
            },
            {
                path: 'puzzles',
                component: ManagePuzzlesComponent
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
