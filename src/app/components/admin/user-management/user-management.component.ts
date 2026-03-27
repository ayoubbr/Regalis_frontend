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

  protected Math = Math;

  users: User[] = [];
  searchQuery = '';
  roleFilter = '';
  sortField = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Pagination state
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isLastPage = false;

  // Modal state
  isModalOpen = false;
  isEditing = false;
  currentUser: any = {
    username: '', email: '', password: '',
    firstName: '', lastName: '', role: Role.USER
  };

  roles = Object.values(Role);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll({
      page: this.currentPage,
      size: this.pageSize,
      search: this.searchQuery,
      role: this.roleFilter,
      sort: `${this.sortField},${this.sortDirection}`
    }).subscribe({
      next: (response) => {
        this.users = response.content;        
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLastPage = response.last;
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.toastService.showError('Failed to load users.');
      }
    });
  }

  onSearch(): void { 
    this.currentPage = 0;
    this.loadUsers(); 
  }

  onRoleFilterChange(): void { 
    this.currentPage = 0;
    this.loadUsers(); 
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.currentPage = 0;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'unfold_more';
    return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  // Modal actions
  openCreateModal(): void {
    this.resetForm();
    this.isModalOpen = true;
  }

  onEdit(user: User): void {
    this.currentUser = {
      id: user.id, username: user.username, email: user.email,
      password: '', firstName: user.firstName || '',
      lastName: user.lastName || '', role: user.role
    };
    this.isEditing = true;
    this.isModalOpen = true;
  }

  closeModal(): void { this.isModalOpen = false; }

  resetForm(): void {
    this.isEditing = false;
    this.currentUser = {
      username: '', email: '', password: '',
      firstName: '', lastName: '', role: Role.USER
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
        email: this.currentUser.email, firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName, role: this.currentUser.role
      };
      if (this.currentUser.password) dto.password = this.currentUser.password;

      this.userService.update(this.currentUser.id, dto).subscribe({
        next: () => { this.loadUsers(); this.closeModal(); this.toastService.showSuccess('User updated!'); },
        error: () => this.toastService.showError('Failed to update user.')
      });
    } else {
      this.userService.create(this.currentUser).subscribe({
        next: () => { this.loadUsers(); this.closeModal(); this.toastService.showSuccess('User created!'); },
        error: () => this.toastService.showError('Failed to create user.')
      });
    }
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe({
        next: () => { this.loadUsers(); this.toastService.showSuccess('User deleted!'); },
        error: () => this.toastService.showError('Failed to delete user.')
      });
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'badge-red';
      default: return 'badge-slate';
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
