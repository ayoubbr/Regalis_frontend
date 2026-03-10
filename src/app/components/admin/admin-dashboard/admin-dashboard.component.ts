import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ModuleService } from '../../../core/services/module.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private userService = inject(UserService);
  private moduleService = inject(ModuleService);

  stats = {
    totalUsers: 0,
    activeNow: 85, // Mocked for now
    totalModules: 0,
    totalXP: '2.4M', // Mocked for now
    popularModule: 'Opening Masterclass'
  };

  recentActivity = [
    { type: 'achievement', user: 'jessica88', message: 'reached 100 day streak!', time: '2 MINS AGO', icon: 'auto_awesome' },
    { type: 'registration', user: 'Marco Rossi', message: 'just joined from Italy 🇮🇹', time: '15 MINS AGO', icon: 'person_add' },
    { type: 'update', user: 'Spanish 101', message: 'Lesson 4 content modified.', time: '1 HOUR AGO', icon: 'edit_note' },
    { type: 'alert', user: 'System', message: 'Server load increased to 85%.', time: '3 HOURS AGO', icon: 'warning', critical: true }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      users: this.userService.getAll(),
      modules: this.moduleService.getAll()
    }).subscribe({
      next: (data) => {
        this.stats.totalUsers = data.users.length;
        this.stats.totalModules = data.modules.length;
      },
      error: (err) => console.error('Error loading dashboard data', err)
    });
  }
}
