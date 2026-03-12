import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { User, Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';

  // Modal state
  isModalOpen = false;
  isEditing = false;
  currentUser: any = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: Role.USER
  };

  roles = Object.values(Role);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.toastService.showError('Failed to load users.');
      }
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

  // Modal actions
  openCreateModal(): void {
    this.resetForm();
    this.isModalOpen = true;
  }

  onEdit(user: User): void {
    this.currentUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      password: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role
    };
    this.isEditing = true;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentUser = {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: Role.USER
    };
  }

  saveUser(): void {
    if (!this.currentUser.username || !this.currentUser.email) {
      this.toastService.showError('Username and email are required.');
      return;
    }

    if (!this.isEditing && !this.currentUser.password) {
      this.toastService.showError('Password is required for new users.');
      return;
    }

    if (this.isEditing) {
      const dto: any = {
        email: this.currentUser.email,
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        role: this.currentUser.role
      };
      if (this.currentUser.password) {
        dto.password = this.currentUser.password;
      }

      this.userService.update(this.currentUser.id, dto).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          this.toastService.showSuccess('User updated successfully!');
        },
        error: (err) => {
          console.error('Error updating user', err);
          this.toastService.showError('Failed to update user.');
        }
      });
    } else {
      const dto: any = {
        username: this.currentUser.username,
        email: this.currentUser.email,
        password: this.currentUser.password,
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        role: this.currentUser.role
      };

      this.userService.create(dto).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          this.toastService.showSuccess('User created successfully!');
        },
        error: (err) => {
          console.error('Error creating user', err);
          this.toastService.showError('Failed to create user.');
        }
      });
    }
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.loadUsers();
          this.toastService.showSuccess('User deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting user', err);
          this.toastService.showError('Failed to delete user.');
        }
      });
    }
  }

  getUserInitials(user: User): string {
    const first = user.firstName ? user.firstName[0] : '';
    const last = user.lastName ? user.lastName[0] : '';
    return (first + last).toUpperCase() || user.username[0].toUpperCase();
  }

  getRoleBadgeClass(role: string): string {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'badge-red';
      case 'PREMIUM': return 'badge-purple';
      case 'INSTRUCTOR': return 'badge-blue';
      default: return 'badge-slate';
    }
  }
}
