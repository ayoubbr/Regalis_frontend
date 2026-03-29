import { AdminComponent } from './components/admin/admin.component';
import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { QuizzesComponent } from './components/admin/quizzes/quizzes.component';
import { ModulesComponent } from './components/admin/modules/modules.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { UserDetailsComponent } from './components/admin/user-details/user-details.component';
import { ManagePuzzlesComponent } from './components/admin/manage-puzzles/manage-puzzles.component';
import { PlayerComponent } from './components/player/player.component';
import { AdventureComponent } from './components/player/adventure/adventure.component';
import { ProfileComponent } from './components/player/profile/profile.component';
import { AcademyComponent } from './components/player/academy/academy.component';
import { LeaderboardComponent } from './components/player/leaderboard/leaderboard.component';
import { ActiveQuizComponent } from './components/player/active-quiz/active-quiz.component';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] },
        children: [
            {
                path: 'dashboard',
                component: AdminDashboardComponent
            },
            {
                path: 'quizzes',
                component: QuizzesComponent
            },
            {
                path: 'quizzes/:id/questions',
                loadComponent: () => import('./components/admin/quizzes/manage-questions/manage-questions.component').then(m => m.ManageQuestionsComponent)
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
                path: 'puzzles/:id/situations',
                loadComponent: () => import('./components/admin/manage-puzzles/situation-management/situation-management.component').then(m => m.SituationManagementComponent)
            },
            {
                path: 'leaderboard',
                loadComponent: () => import('./components/admin/leaderboard/admin-leaderboard.component').then(m => m.AdminLeaderboardComponent)
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
        canActivate: [authGuard],
        children: [
            {
                path: 'academy',
                component: AcademyComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'adventure',
                component: AdventureComponent
            },
            {
                path: 'leaderboard',
                component: LeaderboardComponent
            },
            {
                path: 'quiz-demo',
                component: ActiveQuizComponent
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
