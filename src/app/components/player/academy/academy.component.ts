import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModuleService } from '../../../core/services/module.service';
import { Module } from '../../../core/models/module.model';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './academy.component.html',
  styleUrl: './academy.component.css'
})
export class AcademyComponent implements OnInit {
  private moduleService = inject(ModuleService);
  private userService = inject(UserService);

  modules: any[] = [];
  user: User | null = null;
  loading = true;

  ngOnInit(): void {
    const userId = 1; // Placeholder ID

    forkJoin({
      modules: this.moduleService.getAll().pipe(catchError(() => of([]))),
      user: this.userService.getById(userId).pipe(catchError(() => of(null)))
    }).subscribe(({ modules, user }) => {
      this.user = user;

      // Mock data enhancement for the "Academy" view based on design
      const moduleEnhancements = [
        { level: 'BEGINNER', duration: '5 mins', 
          image: 'https://images.unsplash.com/photo-1587888191477-e74ac6bc9c4b?q=80&w=1214&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { level: 'INTERMEDIATE', duration: '8 mins', 
          image: 'https://images.unsplash.com/photo-1619163413327-546fdb903195?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { level: 'ADVANCED', duration: '12 mins', 
          image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=600&auto=format&fit=crop' },
        { level: 'TIMED', duration: '3 mins', 
          image: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=1258&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
      ];

      this.modules = modules.map((m, index) => {
        const enhancement = moduleEnhancements[index % moduleEnhancements.length];
        return {
          ...m,
          level: enhancement.level,
          duration: enhancement.duration,
          image: enhancement.image,
          // questionsCount: m.lessons?.length || 0
        };
      });

      this.loading = false;
    });
  }
}
