import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizQuestion, QuizResult, QuizOption } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-active-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-quiz.component.html',
  styleUrl: './active-quiz.component.css'
})
export class ActiveQuizComponent implements OnInit, OnDestroy {
  @Input() title: string = 'Regalis Quiz';
  @Input() subtitle: string = 'CHALLENGE SERIES';
  @Input() questions: QuizQuestion[] = [];
  @Input() initialTime: number = 600; // 10 minutes in seconds

  @Output() completed = new EventEmitter<QuizResult[]>();
  @Output() closed = new EventEmitter<void>();

  currentQuestionIndex: number = 0;
  selectedOptionId: string | null = null;
  isAnswerChecked: boolean = false;
  
  timeLeft: number = 0;
  timerInterval: any;
  
  results: QuizResult[] = [];
  startTime: number = 0;

  ngOnInit(): void {
    this.timeLeft = this.initialTime;
    this.startTimer();
    this.startTime = Date.now();
    
    // For demo purposes, if no questions provided, load some mock ones
    if (this.questions.length === 0) {
      this.loadMockQuestions();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  get currentQuestion(): QuizQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  get progressPercentage(): number {
    if (this.questions.length === 0) return 0;
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  get minutes(): string {
    return Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
  }

  get seconds(): string {
    return (this.timeLeft % 60).toString().padStart(2, '0');
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  selectOption(optionId: string): void {
    if (this.isAnswerChecked) return;
    this.selectedOptionId = optionId;
  }

  checkAnswer(): void {
    if (!this.selectedOptionId || this.isAnswerChecked) return;
    
    this.isAnswerChecked = true;
    const isCorrect = this.selectedOptionId === this.currentQuestion.correctOptionId;
    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    
    this.results.push({
      questionId: this.currentQuestion.id,
      selectedOptionId: this.selectedOptionId,
      isCorrect: isCorrect,
      timeSpent: timeSpent
    });
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedOptionId = null;
      this.isAnswerChecked = false;
      this.startTime = Date.now();
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

  private loadMockQuestions(): void {
    this.questions = [
      {
        id: 1,
        text: 'Which of these ancient structures serves as the primary gateway to the Regalis Kingdom?',
        options: [
          { id: 'A', label: 'A', text: 'The Emerald Archway' },
          { id: 'B', label: 'B', text: 'The Silver Spire' },
          { id: 'C', label: 'C', text: 'Iron Citadel Gate' },
          { id: 'D', label: 'D', text: 'Crystal Cascades' }
        ],
        correctOptionId: 'A',
        hint: 'Hmm, this one is tricky! The architecture here is quite unique... what do you think?',
        xpReward: 200
      },
      {
        id: 2,
        text: 'What is the highest title reachable in the Regalis Leaderboard?',
        options: [
          { id: 'A', label: 'A', text: 'Emerald King' },
          { id: 'B', label: 'B', text: 'Grandmaster' },
          { id: 'C', label: 'C', text: 'Regalis Champion' },
          { id: 'D', label: 'D', text: 'Ancient Guardian' }
        ],
        correctOptionId: 'B',
        hint: 'It sounds like someone who has mastered everything!',
        xpReward: 150
      }
    ];
  }
}
