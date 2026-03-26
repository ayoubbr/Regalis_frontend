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
  filteredQuizzes: Quiz[] = [];

  modules: Module[] = [];

  searchQuery: string = '';
  selectedModule: string = '';
  selectedDifficulty: string = '';

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
    this.quizService.getAll().subscribe({
      next: (data) => {
        this.quizzes = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching quizzes', err);
        this.toastService.showError('Failed to load quizzes.');
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredQuizzes = this.quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        quiz.content.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesModule = !this.selectedModule || quiz.moduleId === +this.selectedModule;

      const matchesDifficulty = !this.selectedDifficulty || quiz.difficulty === +this.selectedDifficulty;

      return matchesSearch && matchesModule && matchesDifficulty;
    });
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
