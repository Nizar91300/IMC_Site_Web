import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ImcService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  calculateImc(poids: number, taille: number, token: string): Observable<any> {
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }
    return this.http.post(`${this.apiUrl}/calc_imc/`, { poids, taille }, { headers });
  }

  // Récupère l'historique des calculs
  getHistory(): Observable<any> {
    if ( !this.authService.isLoggedIn$ ) {
      throw new Error("Utilisateur non authentifié");
    }
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    return this.http.get(`${this.apiUrl}/imc_history/`, { headers });
  }
}
