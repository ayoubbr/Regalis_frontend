import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardActivity } from '../../../core/models/dashboard-stats.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  stats = {
    totalUsers: 0,
    activeNow: 0,
    totalModules: 0,
    totalXP: '0',
    popularModule: 'Opening Masterclass' // Still mocked for now as it needs more complex logic
  };

  recentActivity: DashboardActivity[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.totalUsers = data.totalUsers;
        this.stats.activeNow = data.activeUsers;
        this.stats.totalModules = data.totalModules;
        this.stats.totalXP = this.formatXP(data.totalXp);
        this.recentActivity = data.recentActivities;
      },
      error: (err) => console.error('Error loading dashboard data', err)
    });
  }

  private formatXP(xp: number): string {
    if (xp >= 1000000) {
      return (xp / 1000000).toFixed(1) + 'M';
    } else if (xp >= 1000) {
      return (xp / 1000).toFixed(1) + 'K';
    }
    return xp.toString();
  }
}
