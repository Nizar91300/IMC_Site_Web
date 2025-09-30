import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImcService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  calculateImc(poids: number, taille: number, token: string): Observable<any> {
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }
    return this.http.post(`${this.apiUrl}/calc_imc/`, { poids, taille }, { headers });
  }

  getHistory(token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });
    return this.http.get(`${this.apiUrl}/history/`, { headers });
  }
}
