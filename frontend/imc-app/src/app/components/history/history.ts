import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImcService } from '../../services/imc';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class HistoryComponent implements OnInit {
  history: any[] = [];
  error: string | null = null;
  isLoading = false;

  constructor(private imcService: ImcService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.error = null;

    this.imcService.getHistory().subscribe({
      next: (res) => {
        this.history = res;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 401) {
          this.error = "Vous devez être connecté pour voir l'historique.";
        } else {
          this.error = "Erreur lors du chargement de l'historique.";
        }
        this.isLoading = false;
      }
    });
  }
}
