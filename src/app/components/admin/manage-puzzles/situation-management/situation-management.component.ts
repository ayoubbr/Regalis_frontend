import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SituationService } from '../../../../core/services/situation.service';
import { PuzzleService } from '../../../../core/services/puzzle.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Situation, Puzzle } from '../../../../core/models/puzzle.model';

@Component({
  selector: 'app-situation-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './situation-management.component.html',
  styleUrl: './situation-management.component.css'
})
export class SituationManagementComponent implements OnInit {
  private situationService = inject(SituationService);
  private puzzleService = inject(PuzzleService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  puzzleId: number | null = null;
  puzzle: Puzzle | null = null;
  situations: Situation[] = [];
  
  isLoading = true;
  isCreating = false;
  isEditingId: number | null = null;
  situationForm: FormGroup;

  constructor() {
    this.situationForm = this.fb.group({
      fenPosition: ['', [Validators.required]],
      correctMove: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.puzzleId = +params['id'];
      if (this.puzzleId) {
        this.fetchPuzzle();
        this.fetchSituations();
      }
    });
  }

  fetchPuzzle() {
    if (!this.puzzleId) return;
    this.puzzleService.getById(this.puzzleId).subscribe({
      next: (data) => this.puzzle = data,
      error: () => this.toastService.showError('Could not find puzzle')
    });
  }

  fetchSituations() {
    if (!this.puzzleId) return;
    this.isLoading = true;
    this.situationService.getByPuzzleId(this.puzzleId).subscribe({
      next: (data) => {
        this.situations = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.showError('Error fetching situations');
        this.isLoading = false;
      }
    });
  }

  openCreateModal() {
    this.isCreating = true;
    this.isEditingId = null;
    this.situationForm.reset({
      fenPosition: '',
      correctMove: '',
      description: ''
    });
  }

  openEditModal(situation: Situation) {
    this.isCreating = true;
    this.isEditingId = situation.id ?? null;
    this.situationForm.patchValue({
      fenPosition: situation.fenPosition,
      correctMove: situation.correctMove,
      description: situation.description
    });
  }

  closeModal() {
    this.isCreating = false;
    this.isEditingId = null;
  }

  saveSituation() {
    if (this.situationForm.invalid || !this.puzzleId) {
      this.situationForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.situationForm.value,
      puzzleId: this.puzzleId
    };

    if (this.isEditingId) {
      this.situationService.update(this.isEditingId, payload).subscribe({
        next: (res) => {
          const index = this.situations.findIndex(s => s.id === res.id);
          if (index !== -1) {
            this.situations[index] = res;
          }
          this.toastService.showSuccess('Situation updated');
          this.closeModal();
        },
        error: () => this.toastService.showError('Failed to update')
      });
    } else {
      this.situationService.create(payload).subscribe({
        next: (res) => {
          this.situations.push(res);
          this.toastService.showSuccess('Situation added');
          this.closeModal();
        },
        error: () => this.toastService.showError('Failed to create')
      });
    }
  }

  deleteSituation(id: number) {
    if (confirm('Permanently delete this position?')) {
      this.situationService.delete(id).subscribe({
        next: () => {
          this.situations = this.situations.filter(s => s.id !== id);
          this.toastService.showSuccess('Deleted');
        },
        error: () => this.toastService.showError('Failed to delete')
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/puzzles']);
  }

  getFenImageUrl(fen: string): string {
    if (!fen) return '';
    return `https://fen2image.chessvision.ai/${fen.replace(/\s+/g, '%20')}`;
  }
}
