import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleService } from '../../../core/services/module.service';
import { Module } from '../../../core/models/module.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserProgressService } from '../../../core/services/user-progress.service';
import { forkJoin } from 'rxjs';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-adventure',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adventure.component.html',
  styleUrl: './adventure.component.css'
})
export class AdventureComponent implements OnInit {
  modules: any[] = [];
  roadPath: string = '';
  loading = true;
  
  constructor(
    private moduleService: ModuleService,
    public authService: AuthService,
    private userProgressService: UserProgressService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user && user.id) {
        this.loadAdventure(user.id);
      }
    });
  }

  loadAdventure(userId: number): void {
    this.loading = true;
    forkJoin({
      allModules: this.moduleService.getAll(),
      userProgress: this.userProgressService.getUserProgress(userId)
    }).subscribe(({ allModules, userProgress }) => {
      const sortedModules = allModules.sort((a, b) => a.orderIndex - b.orderIndex);
      
      let foundActive = false;

      this.modules = sortedModules.map((mod, index) => {
        // Mocking the status based on order for now until we have lesson mapping in progress
        const completedCount = userProgress.filter(p => p.completed).length; 
        
        // Assume 3 lessons per module if lessonCount is missing
        const lessonsPerModule = mod.lessonCount || 3;
        const modulesCompleted = Math.floor(completedCount / lessonsPerModule);

        let status = 'locked';
        if (index < modulesCompleted) {
          status = 'completed';
        } else if (!foundActive) {
          status = 'active';
          foundActive = true;
        }

        return {
          ...mod,
          status: status,
          label: mod.name
        };
      });

      this.loading = false;
    });
  }

  getNodeOffset(index: number): number {
    // Return a horizontal offset in pixels to create a wavy effect
    // Alternates: 0, 50, 80, 50, 0, -50, -80, -50...
    const offsets = [0, 45, 75, 45, 0, -45, -75, -45];
    return offsets[index % offsets.length];
  }

  getNodeIcon(index: number): string {
      const mod = this.modules[index];
      if (mod?.status === 'completed') return 'check_circle';
      if (mod?.status === 'active') return 'star';
      if (index % 5 === 4) return 'trophy';
      return 'lock';
  }
}
