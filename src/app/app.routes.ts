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
import { ProfileComponent } from './components/player/profile/profile.component';
import { AcademyComponent } from './components/player/academy/academy.component';
import { LeaderboardComponent } from './components/player/leaderboard/leaderboard.component';
import { ChallengesPuzzlesComponent } from './components/player/challenges-puzzles/challenges-puzzles.component';
import { DailyChallengeComponent } from './components/player/daily-challenge/daily-challenge.component';
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
                path: 'challenges',
                component: ChallengesPuzzlesComponent
            },
            {
                path: 'quiz-demo',
                component: ActiveQuizComponent
            },
            {
                path: 'daily-challenge',
                component: DailyChallengeComponent
            },
            {
                path: 'arena',
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
