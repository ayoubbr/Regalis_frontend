import { AdminComponent } from './components/admin/admin.component';
import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { LessonsComponent } from './components/admin/lessons/lessons.component';
import { ModulesComponent } from './components/admin/modules/modules.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { UserDetailsComponent } from './components/admin/user-details/user-details.component';
import { ManagePuzzlesComponent } from './components/admin/manage-puzzles/manage-puzzles.component';
import { ManageChallengesComponent } from './components/admin/manage-challenges/manage-challenges.component';
import { PlayerComponent } from './components/player/player.component';
import { AdventureComponent } from './components/player/adventure/adventure.component';

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
                path: 'users/details/:id',
                component: UserDetailsComponent
            },
            {
                path: 'puzzles',
                component: ManagePuzzlesComponent
            },
            {
                path: 'challenges',
                component: ManageChallengesComponent
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'player',
        component: PlayerComponent,
        children: [
            {
                path: 'adventure',
                component: AdventureComponent
            },
            {
                path: '',
                redirectTo: 'adventure',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'player',
        pathMatch: 'full'
    }
];
