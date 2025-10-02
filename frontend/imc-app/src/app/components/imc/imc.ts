import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImcService } from '../../services/imc';

@Component({
  selector: 'app-imc',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './imc.html',
  styleUrls: ['./imc.css']
})
export class ImcComponent {
  poids!: number;
  taille!: number;
  result: any;
  error: string | null = null;
  isLoading = false;

  constructor(private imcService: ImcService) {}

  calculate() {
    if (this.isLoading) {
      return;
    }

    // vérifier les valeurs
    if (!this.poids || !this.taille || this.poids <= 0 || this.taille <= 0) {
      this.error = "Veuillez entrer des valeurs valides pour le poids et la taille.";
      this.result = null;
      return;
    }

    this.error = null;
    this.result = null;
    this.isLoading = true;
    
    const token = localStorage.getItem('token');

    this.imcService.calculateImc(this.poids, this.taille, token || "").subscribe({
      next: (res) => {
        this.result = res;
        this.error = null;
        this.isLoading = false;
      },
      error: () => {
        this.error = "Erreur lors du calcul.";
        this.isLoading = false;
      }
    });
  }
}
