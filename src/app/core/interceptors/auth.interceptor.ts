import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // To avoid NG0200 Circular Dependency with AuthService, read directly from localStorage
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
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};
