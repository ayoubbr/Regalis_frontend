import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PuzzleService } from '../../../core/services/puzzle.service';
import { ModuleService } from '../../../core/services/module.service';
import { ToastService } from '../../../core/services/toast.service';
import { Puzzle } from '../../../core/models/puzzle.model';
import { Module } from '../../../core/models/module.model';

@Component({
  selector: 'app-manage-puzzles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-puzzles.component.html',
  styleUrl: './manage-puzzles.component.css'
})
export class ManagePuzzlesComponent implements OnInit {
  private puzzleService = inject(PuzzleService);
  private moduleService = inject(ModuleService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  puzzles: Puzzle[] = [];
  modules: Module[] = [];

  isLoading = true;
  error: string | null = null;
  isCreating = false;
  isEditingPuzzleId: number | null = null;

  puzzleForm: FormGroup;

  constructor() {
    this.puzzleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      difficulty: [1000, [Validators.required, Validators.min(0)]],
      xpReward: [50, [Validators.required, Validators.min(0)]],
      moduleId: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.fetchPuzzles();
    this.fetchModules();
  }

  fetchPuzzles() {
    this.isLoading = true;
    this.puzzleService.getAll().subscribe({
      next: (data) => {
        this.puzzles = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching puzzles', err);
        this.error = 'Failed to load puzzles';
        this.toastService.showError('Failed to load puzzles');
        this.isLoading = false;
      }
    });
  }

  fetchModules() {
    this.moduleService.getAll().subscribe({
      next: (data) => this.modules = data,
      error: (err) => {
        console.error('Error fetching modules', err);
        this.toastService.showError('Error fetching modules');
      }
    });
  }

  get filteredPuzzles(): Puzzle[] {
    return this.puzzles;
  }

  getModuleName(id: number): string {
    const mod = this.modules.find(m => m.id === id);
    return mod ? mod.name : 'Unknown';
  }

  openCreateModal() {
    this.isCreating = true;
    this.isEditingPuzzleId = null;
    this.puzzleForm.reset({
      title: '',
      description: '',
      difficulty: 1000,
      xpReward: 50,
      moduleId: ''
    });
  }

  openEditModal(puzzle: Puzzle) {
    this.isCreating = true;
    this.isEditingPuzzleId = puzzle.id ?? null;
    this.puzzleForm.patchValue({
      title: puzzle.title,
      description: puzzle.description,
      difficulty: puzzle.difficulty,
      xpReward: puzzle.xpReward,
      moduleId: puzzle.moduleId
    });
  }

  navigateToSituations(puzzleId: number) {
    this.router.navigate(['/admin/puzzles', puzzleId, 'situations']);
  }

  closeCreateModal() {
    this.isCreating = false;
    this.isEditingPuzzleId = null;
  }

  savePuzzle() {
    if (this.puzzleForm.invalid) {
      this.puzzleForm.markAllAsTouched();
      this.toastService.showError('Please fill in all required fields correctly.');
      return;
    }

    if (this.isEditingPuzzleId) {
      this.puzzleService.update(this.isEditingPuzzleId, this.puzzleForm.value).subscribe({
        next: (updatedPuzzle) => {
          const index = this.puzzles.findIndex(p => p.id === updatedPuzzle.id);
          if (index !== -1) {
            this.puzzles[index] = updatedPuzzle;
          }
          this.toastService.showSuccess('Puzzle updated successfully!');
          this.closeCreateModal();
        },
        error: (err) => {
          console.error('Error updating puzzle', err);
          this.toastService.showError('Failed to update puzzle.');
        }
      });
    } else {
      this.puzzleService.create(this.puzzleForm.value).subscribe({
        next: (newPuzzle) => {
          this.puzzles.unshift(newPuzzle);
          this.toastService.showSuccess('Puzzle created successfully!');
          this.closeCreateModal();
        },
        error: (err) => {
          console.error('Error creating puzzle', err);
          this.toastService.showError('Failed to create puzzle. Please try again.');
        }
      });
    }
  }

  deletePuzzle(id: number) {
    if (confirm('Are you sure you want to delete this puzzle?')) {
      this.puzzleService.delete(id).subscribe({
        next: () => {
          this.puzzles = this.puzzles.filter(p => p.id !== id);
          this.toastService.showSuccess('Puzzle deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting puzzle', err);
          this.toastService.showError('Failed to delete puzzle. Make sure it has no active attempts.');
        }
      });
    }
  }

  getDifficultyLabel(difficulty: number): string {
    if (difficulty <= 1000) return 'Easy';
    if (difficulty <= 1600) return 'Medium';
    return 'Hard';
  }

  getFenImageUrl(fen: string): string {
    if (!fen) return '';
    const formattedFen = fen.replace(/\s+/g, '%20');
    return `https://fen2image.chessvision.ai/${formattedFen}`;
  }
}
