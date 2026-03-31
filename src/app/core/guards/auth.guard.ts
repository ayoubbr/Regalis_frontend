import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // check if route has restricted roles
    const roles = route.data['roles'] as Array<string>;
    if (roles) {
      const userRoles = authService.getRoles();
      const hasRole = roles.some(role => userRoles.includes(role));
      
      if (!hasRole) {
        router.navigate(['/']);
        return false;
      }
    }
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
