import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api-ficticia-auth.exemplo.com/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    // Simulando uma chamada de API
    return this.http.post<{token: string, user: User}>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        // Simulando resposta para desenvolvimento
        map(() => {
          const user: User = {
            id: 1,
            email: email,
            name: email.split('@')[0]
          };
          const token = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
          
          // Armazenar detalhes do usuário e token no localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem(this.tokenKey, token);
          
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(error => {
          return throwError(() => new Error('Falha no login. Verifique suas credenciais.'));
        })
      );
  }

  logout(): void {
    // Remover usuário do localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }
}
