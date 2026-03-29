import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuestionService } from '../../../../core/services/question.service';
import { QuizService } from '../../../../core/services/quiz.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Question } from '../../../../core/models/question.model';
import { Quiz } from '../../../../core/models/quiz.model';

@Component({
  selector: 'app-manage-questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './manage-questions.component.html',
  styleUrl: './manage-questions.component.css'
})
export class ManageQuestionsComponent implements OnInit {
  private questionService = inject(QuestionService);
  private quizService = inject(QuizService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  quizId: number | null = null;
  quiz: Quiz | null = null;
  questions: Question[] = [];
  
  isLoading = true;
  isCreating = false;
  isEditingId: number | null = null;
  questionForm: FormGroup;

  constructor() {
    this.questionForm = this.fb.group({
      text: ['', [Validators.required]],
      options: this.fb.array([
        this.createOptionControl()
      ]),
      correctOptionId: ['', [Validators.required]],
      hint: [''],
      xpReward: [50, [Validators.required, Validators.min(1)]]
    });
  }

  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  createOptionControl() {
    return this.fb.control('', Validators.required);
  }

  addOption() {
    this.optionsArray.push(this.createOptionControl());
  }

  removeOption(index: number) {
    if (this.optionsArray.length > 1) {
      this.optionsArray.removeAt(index);
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.quizId = +params['id'];
      if (this.quizId) {
        this.fetchQuiz();
        this.fetchQuestions();
      }
    });
  }

  fetchQuiz() {
    if (!this.quizId) return;
    this.quizService.getById(this.quizId).subscribe({
      next: (data) => this.quiz = data,
      error: () => this.toastService.showError('Could not find quiz')
    });
  }

  fetchQuestions() {
    if (!this.quizId) return;
    this.isLoading = true;
    this.questionService.getQuestionsByQuizId(this.quizId).subscribe({
      next: (data) => {
        this.questions = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.showError('Error fetching questions');
        this.isLoading = false;
      }
    });
  }

  openCreateModal() {
    this.isCreating = true;
    this.isEditingId = null;
    this.optionsArray.clear();
    this.optionsArray.push(this.createOptionControl());
    this.optionsArray.push(this.createOptionControl());
    
    this.questionForm.reset({
      text: '',
      correctOptionId: '',
      hint: '',
      xpReward: 50
    });
  }

  openEditModal(question: Question) {
    this.isCreating = true;
    this.isEditingId = question.id ?? null;
    
    this.optionsArray.clear();
    const parsedOptions = question.options ? question.options.split(';') : [];
    
    if (parsedOptions.length === 0) {
      this.optionsArray.push(this.createOptionControl());
    } else {
      parsedOptions.forEach(opt => {
        const control = this.createOptionControl();
        control.setValue(opt);
        this.optionsArray.push(control);
      });
    }

    this.questionForm.patchValue({
      text: question.text,
      correctOptionId: question.correctOptionId,
      hint: question.hint,
      xpReward: question.xpReward
    });
  }

  closeModal() {
    this.isCreating = false;
    this.isEditingId = null;
  }

  saveQuestion() {
    if (this.questionForm.invalid || !this.quizId) {
      this.questionForm.markAllAsTouched();
      return;
    }

    // Join options with ;
    const rawOptions: string[] = this.questionForm.value.options;
    const joinedOptions = rawOptions.map(opt => opt.trim()).filter(opt => opt !== '').join(';');

    const payload = {
      ...this.questionForm.value,
      options: joinedOptions,
      quizId: this.quizId
    };

    if (this.isEditingId) {
      this.questionService.updateQuestion(this.isEditingId, payload).subscribe({
        next: (res) => {
          const index = this.questions.findIndex(q => q.id === res.id);
          if (index !== -1) {
            this.questions[index] = res;
          }
          this.toastService.showSuccess('Question updated');
          this.closeModal();
        },
        error: () => this.toastService.showError('Failed to update')
      });
    } else {
      this.questionService.createQuestion(payload).subscribe({
        next: (res) => {
          this.questions.push(res);
          this.toastService.showSuccess('Question added');
          this.closeModal();
        },
        error: () => this.toastService.showError('Failed to create')
      });
    }
  }

  deleteQuestion(id: number) {
    if (confirm('Permanently delete this question?')) {
      this.questionService.deleteQuestion(id).subscribe({
        next: () => {
          this.questions = this.questions.filter(q => q.id !== id);
          this.toastService.showSuccess('Deleted');
        },
        error: () => this.toastService.showError('Failed to delete')
      });
    }
  }

  getParsedOptions(optionsString: string): string[] {
    if (!optionsString) return [];
    return optionsString.split(';').filter(o => o.trim() !== '');
  }

  goBack() {
    this.router.navigate(['/admin/quizzes']);
  }
}
