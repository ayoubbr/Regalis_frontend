import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

const AUTH_API = 'http://localhost:8080/api/auth/';
const USER_API = 'http://localhost:8080/api/users/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserSubject = new BehaviorSubject<any>(savedUser);
    this.currentUser = this.currentUserSubject.asObservable();
    
    // Auto update profile on app load if logged in
    if (this.isLoggedIn()) {
      this.updateUserProfile().subscribe();
    }
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions).pipe(
      switchMap((user: any) => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          // Fetch full profile immediately
          return this.updateUserProfile();
        }
        return of(user);
      })
    );
  }

  updateUserProfile(): Observable<any> {
    return this.http.get(USER_API + 'me').pipe(
      map(profile => {
        const currentUser = this.currentUserValue;
        const updatedUser = { ...currentUser, ...profile };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        return updatedUser;
      }),
      catchError(err => {
        console.error('Error updating user profile', err);
        return of(this.currentUserValue);
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', user, httpOptions);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next({});
  }

  isLoggedIn(): boolean {
    const user = this.currentUserValue;
    return !!(user && user.token);
  }

  getRoles(): string[] {
    const user = this.currentUserValue;
    return user && user.roles ? user.roles : [];
  }

  getToken(): string | null {
    const user = this.currentUserValue;
    return user ? user.token : null;
  }
}
