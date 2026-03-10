import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LessonService } from '../../../core/services/lesson.service';
import { ModuleService } from '../../../core/services/module.service';
import { Lesson } from '../../../core/models/lesson.model';
import { Module } from '../../../core/models/module.model';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css'
})
export class LessonsComponent implements OnInit {
  private lessonService = inject(LessonService);
  private moduleService = inject(ModuleService);

  lessons: Lesson[] = [];
  filteredLessons: Lesson[] = [];

  modules: Module[] = [];

  searchQuery: string = '';
  selectedModule: string = '';
  selectedDifficulty: string = '';

  ngOnInit(): void {
    this.loadModules();
    this.loadLessons();
  }

  loadModules(): void {
    this.moduleService.getAll().subscribe({
      next: (data) => {
        this.modules = data;
      },
      error: (err) => console.error('Error fetching modules', err)
    });
  }

  loadLessons(): void {
    this.lessonService.getAll().subscribe({
      next: (data) => {
        this.lessons = data;
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching lessons', err)
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredLessons = this.lessons.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        lesson.content.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesModule = !this.selectedModule || lesson.moduleId === +this.selectedModule;

      const matchesDifficulty = !this.selectedDifficulty || lesson.difficulty === +this.selectedDifficulty;

      return matchesSearch && matchesModule && matchesDifficulty;
    });
  }

  getLessonIcon(lesson: Lesson): string {
    // Return different icons based on module or difficulty
    if (lesson.moduleId === 1) return 'castle';
    if (lesson.moduleId === 2) return 'military_tech';
    if (lesson.moduleId === 3) return 'target';
    return 'menu_book';
  }

  getModuleName(lesson: Lesson): string {
    const mod = this.modules.find(m => m.id === lesson.moduleId);
    return mod ? mod.name : 'General';
  }

  getModuleBadgeClass(lesson: Lesson): string {
    if (lesson.moduleId === 1) return 'badge-blue';
    if (lesson.moduleId === 2) return 'badge-red';
    if (lesson.moduleId === 3) return 'badge-purple';
    return 'badge-slate';
  }

  getDifficultyLabel(lesson: Lesson): string {
    switch (lesson.difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Mixed';
    }
  }

  getDifficultyBadgeClass(lesson: Lesson): string {
    switch (lesson.difficulty) {
      case 1: return 'badge-green';
      case 2: return 'badge-orange';
      case 3: return 'badge-red';
      default: return 'badge-slate';
    }
  }

  onEdit(lesson: Lesson): void {
    this.currentLesson = { ...lesson };
    this.isEditing = true;
    this.isModalOpen = true;
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this lesson?')) {
      this.lessonService.delete(id).subscribe({
        next: () => this.loadLessons(),
        error: (err) => console.error('Error deleting lesson', err)
      });
    }
  }

  // Modal logic
  isModalOpen = false;
  isEditing = false;
  currentLesson: any = {
    title: '',
    content: '',
    difficulty: 1,
    xpReward: 100,
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
    this.currentLesson = {
      title: '',
      content: '',
      difficulty: 1,
      xpReward: 100,
      moduleId: this.modules.length > 0 ? this.modules[0].id : null
    };
  }

  saveLesson(): void {
    // Basic validation
    if (!this.currentLesson.title || !this.currentLesson.content || !this.currentLesson.moduleId) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.isEditing) {
      this.lessonService.update(this.currentLesson.id, this.currentLesson).subscribe({
        next: () => {
          this.loadLessons();
          this.closeModal();
        },
        error: (err) => console.error('Error updating lesson', err)
      });
    } else {
      this.lessonService.create(this.currentLesson).subscribe({
        next: () => {
          this.loadLessons();
          this.closeModal();
        },
        error: (err) => console.error('Error creating lesson', err)
      });
    }
  }
}
