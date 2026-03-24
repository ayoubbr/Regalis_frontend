import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.redirectBaseOnRole();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.redirectBaseOnRole();
      },
      error: err => {
        this.errorMessage = err.error.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }

  private redirectBaseOnRole(): void {
    const roles = this.authService.getRoles();
    if (roles.includes('ADMIN')) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/player']);
    }
  }
}
