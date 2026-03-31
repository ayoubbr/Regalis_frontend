import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const router = inject(Router);

  let token = null;
  try {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      token = user.token || user.accessToken;
    }
  } catch (e) {
    console.error('Error parsing user from localStorage in interceptor', e);
  }

  if (token) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(req).pipe(
    catchError((err) => {
      // Catch 401 Unauthorized errors (Token expired)
      if (err.status === 401) {
        // Get AuthService lazily through the injector to break the circular dependency
        const authService = injector.get(AuthService);
        authService.logout();
        router.navigate(['/login'], { queryParams: { expired: true } });
      }
      return throwError(() => err);
    })
  );
};
