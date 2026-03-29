import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../../core/services/quiz.service';
import { ModuleService } from '../../../core/services/module.service';
import { ToastService } from '../../../core/services/toast.service';
import { Quiz } from '../../../core/models/quiz.model';
import { Module } from '../../../core/models/module.model';

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quizzes.component.html',
  styleUrl: './quizzes.component.css'
})
export class QuizzesComponent implements OnInit {
  private quizService = inject(QuizService);
  private moduleService = inject(ModuleService);
  private toastService = inject(ToastService);

  quizzes: Quiz[] = [];
  modules: Module[] = [];

  protected Math = Math;

  searchQuery = '';
  moduleFilter = '';
  sortField = 'difficulty';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination state
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isLastPage = false;

  ngOnInit(): void {
    this.loadModules();
    this.loadQuizzes();
  }

  loadModules(): void {
    this.moduleService.getAll().subscribe({
      next: (data) => {
        this.modules = data;
      },
      error: (err) => {
        console.error('Error fetching modules', err);
        this.toastService.showError('Failed to load modules.');
      }
    });
  }

  loadQuizzes(): void {
    this.quizService.getPagedQuizzes({
      page: this.currentPage,
      size: this.pageSize,
      search: this.searchQuery,
      moduleId: this.moduleFilter,
      sort: `${this.sortField},${this.sortDirection}`
    }).subscribe({
      next: (response) => {
        this.quizzes = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLastPage = response.last;
      },
      error: (err) => {
        console.error('Error fetching quizzes', err);
        this.toastService.showError('Failed to load quizzes.');
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadQuizzes();
  }

  onModuleFilterChange(): void {
    this.currentPage = 0;
    this.loadQuizzes();
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
    this.loadQuizzes();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadQuizzes();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'unfold_more';
    return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  getQuizIcon(quiz: Quiz): string {
    // Return different icons based on module or difficulty
    if (quiz.moduleId === 1) return 'castle';
    if (quiz.moduleId === 2) return 'military_tech';
    if (quiz.moduleId === 3) return 'target';
    return 'menu_book';
  }

  getModuleName(quiz: Quiz): string {
    const mod = this.modules.find(m => m.id === quiz.moduleId);
    return mod ? mod.name : 'General';
  }

  getModuleBadgeClass(quiz: Quiz): string {
    if (quiz.moduleId === 1) return 'badge-blue';
    if (quiz.moduleId === 2) return 'badge-red';
    if (quiz.moduleId === 3) return 'badge-purple';
    return 'badge-slate';
  }

  getDifficultyLabel(quiz: Quiz): string {
    switch (quiz.difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Mixed';
    }
  }

  getDifficultyBadgeClass(quiz: Quiz): string {
    switch (quiz.difficulty) {
      case 1: return 'badge-green';
      case 2: return 'badge-orange';
      case 3: return 'badge-red';
      default: return 'badge-slate';
    }
  }

  getQuizTotalXp(quiz: Quiz): number {
    if (!quiz.questions || quiz.questions.length === 0) return 0;
    return quiz.questions.reduce((sum, q) => sum + (q.xpReward || 0), 0);
  }

  onEdit(quiz: Quiz): void {
    this.currentQuiz = { ...quiz };
    this.isEditing = true;
    this.isModalOpen = true;
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.quizService.delete(id).subscribe({
        next: () => {
          this.loadQuizzes();
          this.toastService.showSuccess('Quiz deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting quiz', err);
          this.toastService.showError('Failed to delete quiz.');
        }
      });
    }
  }

  // Modal logic
  isModalOpen = false;
  isEditing = false;
  currentQuiz: any = {
    title: '',
    content: '',
    difficulty: 1,
    moduleId: null
  };

  openCreateModal(): void {
    this.resetForm();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentQuiz = {
      title: '',
      content: '',
      difficulty: 1,
      moduleId: this.modules.length > 0 ? this.modules[0].id : null
    };
  }

  saveQuiz(): void {
    // Basic validation
    if (!this.currentQuiz.title || !this.currentQuiz.content || !this.currentQuiz.moduleId) {
      this.toastService.showError('Please fill in all required fields.');
      return;
    }

    if (this.isEditing) {
      this.quizService.update(this.currentQuiz.id, this.currentQuiz).subscribe({
        next: () => {
          this.loadQuizzes();
          this.closeModal();
          this.toastService.showSuccess('Quiz updated successfully!');
        },
        error: (err) => {
          console.error('Error updating quiz', err);
          this.toastService.showError('Failed to update quiz.');
        }
      });
    } else {
      this.quizService.create(this.currentQuiz).subscribe({
        next: () => {
          this.loadQuizzes();
          this.closeModal();
          this.toastService.showSuccess('Quiz created successfully!');
        },
        error: (err) => {
          console.error('Error creating quiz', err);
          this.toastService.showError('Failed to create quiz.');
        }
      });
    }
  }
}
