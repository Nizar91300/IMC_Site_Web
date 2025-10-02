import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Django API
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken(); // Vérifie une seule fois au démarrage
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { username, password });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, { username, email, password });
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('token')) {
      this.http.get(`${this.apiUrl}/verify-token/`, { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }).subscribe({
        next: () => {
          return true;
        },
        error: () => {
          localStorage.removeItem('token');
          return false;
        }
      });
    }
    return false;
  }

  private checkToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.loggedIn.next(false);
      return;
    }

    this.http.get(`${this.apiUrl}/verify-token/`, {
      headers: { Authorization: `Token ${token}` }
    }).subscribe({
      next: () => this.loggedIn.next(true),
      error: () => {
        localStorage.removeItem("token");
        this.loggedIn.next(false);
      }
    });
  }

  setToken(token: string) {
    localStorage.setItem("token", token);
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem("token");
    this.loggedIn.next(false);
  }
}
