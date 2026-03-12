import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChallengeService } from '../../../core/services/challenge.service';
import { DailyChallengeService } from '../../../core/services/daily-challenge.service';
import { UserService } from '../../../core/services/user.service';
import { PuzzleService } from '../../../core/services/puzzle.service';
import { ToastService } from '../../../core/services/toast.service';
import { Challenge, ChallengeStatus } from '../../../core/models/challenge.model';
import { DailyChallenge } from '../../../core/models/daily-challenge.model';
import { User } from '../../../core/models/user.model';
import { Puzzle } from '../../../core/models/puzzle.model';

@Component({
  selector: 'app-manage-challenges',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-challenges.component.html',
  styleUrl: './manage-challenges.component.css'
})
export class ManageChallengesComponent implements OnInit {
  private challengeService = inject(ChallengeService);
  private dailyChallengeService = inject(DailyChallengeService);
  private userService = inject(UserService);
  private puzzleService = inject(PuzzleService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  activeTab: 'challenges' | 'daily' = 'challenges';
  challenges: Challenge[] = [];
  dailyChallenges: DailyChallenge[] = [];
  users: User[] = [];
  puzzles: Puzzle[] = [];

  isLoading = true;
  isModalOpen = false;
  isEditing = false;
  editId: number | null = null;

  challengeForm: FormGroup;
  dailyForm: FormGroup;

  constructor() {
    this.challengeForm = this.fb.group({
      challengerId: ['', Validators.required],
      opponentId: ['', Validators.required],
      puzzleId: ['', Validators.required]
    });

    this.dailyForm = this.fb.group({
      userId: ['', Validators.required],
      puzzleId: ['', Validators.required],
      challengeDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    // For simplicity, loading everything. In a real app we might paginate.
    this.userService.getAll().subscribe(data => this.users = data);
    this.puzzleService.getAll().subscribe(data => this.puzzles = data);
    
    this.loadChallenges();
    this.loadDailyChallenges();
  }

  loadChallenges(): void {
    this.challengeService.getAll().subscribe({
      next: (data) => {
        this.challenges = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.showError('Failed to load challenges');
        this.isLoading = false;
      }
    });
  }

  loadDailyChallenges(): void {
    this.dailyChallengeService.getAll().subscribe({
      next: (data) => {
        this.dailyChallenges = data;
      },
      error: (err) => this.toastService.showError('Failed to load daily challenges')
    });
  }

  switchTab(tab: 'challenges' | 'daily'): void {
    this.activeTab = tab;
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.editId = null;
    this.challengeForm.reset({ puzzleId: '', challengerId: '', opponentId: '' });
    this.dailyForm.reset({ userId: '', puzzleId: '', challengeDate: new Date().toISOString().split('T')[0] });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveChallenge(): void {
    if (this.activeTab === 'challenges') {
      if (this.challengeForm.invalid) return;
      this.challengeService.create(this.challengeForm.value).subscribe({
        next: () => {
          this.toastService.showSuccess('Challenge created');
          this.loadChallenges();
          this.closeModal();
        },
        error: (err) => this.toastService.showError('Failed to create challenge')
      });
    } else {
      if (this.dailyForm.invalid) return;
      this.dailyChallengeService.create(this.dailyForm.value).subscribe({
        next: () => {
          this.toastService.showSuccess('Daily challenge created');
          this.loadDailyChallenges();
          this.closeModal();
        },
        error: (err) => this.toastService.showError('Failed to create daily challenge')
      });
    }
  }

  deleteChallenge(id: number): void {
    if (confirm('Are you sure you want to delete this challenge?')) {
      if (this.activeTab === 'challenges') {
        this.challengeService.delete(id).subscribe({
          next: () => {
            this.toastService.showSuccess('Challenge deleted');
            this.loadChallenges();
          },
          error: () => this.toastService.showError('Failed to delete challenge')
        });
      } else {
        this.dailyChallengeService.delete(id).subscribe({
          next: () => {
            this.toastService.showSuccess('Daily challenge deleted');
            this.loadDailyChallenges();
          },
          error: () => this.toastService.showError('Failed to delete daily challenge')
        });
      }
    }
  }

  getUserName(id: number): string {
    const user = this.users.find(u => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : `User ${id}`;
  }

  getPuzzleName(id: number): string {
    return `Puzzle #${id}`;
  }
}
