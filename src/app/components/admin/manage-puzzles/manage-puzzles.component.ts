import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PuzzleService } from '../../../core/services/puzzle.service';
import { CategoryService } from '../../../core/services/category.service';
import { ModuleService } from '../../../core/services/module.service';
import { Puzzle } from '../../../core/models/puzzle.model';
import { Category } from '../../../core/models/category.model';
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
  private categoryService = inject(CategoryService);
  private moduleService = inject(ModuleService);
  private fb = inject(FormBuilder);

  puzzles: Puzzle[] = [];
  categories: Category[] = [];
  modules: Module[] = [];
  selectedCategoryId: number | null = null;

  isLoading = true;
  error: string | null = null;
  isCreating = false;

  puzzleForm: FormGroup;

  constructor() {
    this.puzzleForm = this.fb.group({
      fenPosition: ['', [Validators.required]],
      solutionMoves: ['', [Validators.required]],
      difficulty: [1000, [Validators.required, Validators.min(0)]],
      xpReward: [50, [Validators.required, Validators.min(0)]],
      maxAttempts: [3, [Validators.required, Validators.min(1)]],
      moduleId: ['', [Validators.required]],
      categoryId: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.fetchPuzzles();
    this.fetchCategories();
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
        this.isLoading = false;
      }
    });
  }

  fetchCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  fetchModules() {
    this.moduleService.getAll().subscribe({
      next: (data) => this.modules = data,
      error: (err) => console.error('Error fetching modules', err)
    });
  }

  get filteredPuzzles(): Puzzle[] {
    if (this.selectedCategoryId === null) {
      return this.puzzles;
    }
    return this.puzzles.filter(p => p.categoryId === this.selectedCategoryId);
  }

  filterByCategory(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
  }

  getCategoryName(id: number): string {
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.name : 'Unknown';
  }

  getModuleName(id: number): string {
    const mod = this.modules.find(m => m.id === id);
    return mod ? mod.name : 'Unknown';
  }

  openCreateModal() {
    this.isCreating = true;
    this.puzzleForm.reset({
      fenPosition: '',
      solutionMoves: '',
      difficulty: 1000,
      xpReward: 50,
      maxAttempts: 3,
      moduleId: '',
      categoryId: ''
    });
  }

  closeCreateModal() {
    this.isCreating = false;
  }

  createPuzzle() {
    if (this.puzzleForm.invalid) {
      this.puzzleForm.markAllAsTouched();
      return;
    }
    this.puzzleService.create(this.puzzleForm.value).subscribe({
      next: (newPuzzle) => {
        this.puzzles.unshift(newPuzzle);
        this.closeCreateModal();
      },
      error: (err) => {
        console.error('Error creating puzzle', err);
        alert('Failed to create puzzle. Please try again.');
      }
    });
  }

  getDifficultyLabel(difficulty: number): string {
    if (difficulty <= 1000) return 'Easy';
    if (difficulty <= 1600) return 'Medium';
    return 'Hard';
  }

  getFenImageUrl(fen: string): string {
    // Basic FEN formatting for chessvision API
    // Ensure fen is URL encoded
    if (!fen) return '';
    const formattedFen = fen.replace(/\s+/g, '%20');
    return `https://fen2image.chessvision.ai/${formattedFen}`;
  }
}
