import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImcService } from '../../services/imc';

@Component({
  selector: 'app-imc',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './imc.html'
})
export class ImcComponent {
  poids!: number;
  taille!: number;
  result: any;
  error: string | null = null;

  constructor(private imcService: ImcService) {}

  calculate() {
    const token = localStorage.getItem('token');

    this.imcService.calculateImc(this.poids, this.taille, token || "").subscribe({
      next: (res) => {
        this.result = res;
        this.error = null;
      },
      error: () => {
        this.error = "Erreur lors du calcul.";
      }
    });
  }
}
