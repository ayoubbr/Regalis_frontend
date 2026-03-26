import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz, QuestionResponseDTO, QuizResult, QuizOption, QuizQuestion } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-active-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-quiz.component.html',
  styleUrl: './active-quiz.component.css'
})
export class ActiveQuizComponent implements OnInit {
  @Input() quiz: Quiz | null = null;

  @Output() completed = new EventEmitter<QuizResult[]>();
  @Output() closed = new EventEmitter<void>();

  questions: QuizQuestion[] = [];
  hasError: boolean = false;

  currentQuestionIndex: number = 0;
  selectedOptionId: string | null = null;
  isAnswerChecked: boolean = false;
  
  results: QuizResult[] = [];

  ngOnInit(): void {
    if (this.quiz && this.quiz.questions && this.quiz.questions.length > 0) {
      this.questions = this.quiz.questions.map(q => this.mapQuestion(q));
    } else {
      this.hasError = true;
    }
  }

  private mapQuestion(q: QuestionResponseDTO): QuizQuestion {
    const optionLabels = ['A', 'B', 'C', 'D'];
    const parsedOptions: QuizOption[] = q.options.split(';').map((opt, idx) => ({
      id: opt.trim(),
      label: optionLabels[idx % optionLabels.length],
      text: opt.trim()
    }));

    return {
      id: q.id,
      text: q.text,
      options: parsedOptions,
      correctOptionId: q.correctOptionId,
      hint: q.hint,
      xpReward: q.xpReward
    };
  }

  get currentQuestion(): QuizQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  get progressPercentage(): number {
    if (this.questions.length === 0) return 0;
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  selectOption(optionId: string): void {
    if (this.isAnswerChecked) return;
    this.selectedOptionId = optionId;
  }

  checkAnswer(): void {
    if (!this.selectedOptionId || this.isAnswerChecked) return;
    
    this.isAnswerChecked = true;
    const isCorrect = this.selectedOptionId === this.currentQuestion.correctOptionId;
    
    this.results.push({
      questionId: this.currentQuestion.id,
      selectedOptionId: this.selectedOptionId,
      isCorrect: isCorrect,
      timeSpent: 0
    });
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedOptionId = null;
      this.isAnswerChecked = false;
    } else {
      this.completed.emit(this.results);
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedOptionId = null;
      this.isAnswerChecked = false;
    }
  }

  close(): void {
    this.closed.emit();
  }

  getOptionClass(option: QuizOption): string {
    if (this.isAnswerChecked) {
      if (option.id === this.currentQuestion.correctOptionId) return 'correct';
      if (option.id === this.selectedOptionId && option.id !== this.currentQuestion.correctOptionId) return 'incorrect';
      return 'disabled';
    }
    return this.selectedOptionId === option.id ? 'selected' : '';
  }
}
