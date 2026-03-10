import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);

  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching users', err)
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onEdit(user: User): void {
    console.log('Edit user', user);
    // TODO: Implement user edit modal
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Error deleting user', err)
      });
    }
  }

  getUserInitials(user: User): string {
    const first = user.firstName ? user.firstName[0] : '';
    const last = user.lastName ? user.lastName[0] : '';
    return (first + last).toUpperCase() || user.username[0].toUpperCase();
  }

  getRoleBadgeClass(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin': return 'badge-red';
      case 'premium': return 'badge-purple';
      case 'instructor': return 'badge-blue';
      default: return 'badge-slate';
    }
  }
}
