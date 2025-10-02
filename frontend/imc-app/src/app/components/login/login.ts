import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  token: string | null = null;
  error: string | null = null;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.isLoading) {
      return;
    }

    // vérifier les champs
    if (!this.username || !this.password) {
      this.error = "Veuillez remplir tous les champs.";
      return;
    }

    if (this.username.length < 3 ){
      this.error = "Le nom d'utilisateur doit contenir au moins 3 caractères.";
      return;
    }
    if (this.password.length < 6 ){
      this.error = "Le mot de passe doit contenir au moins 6 caractères.";
      return;
    }

    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.token = res.token;
        if (this.token) {
          this.authService.setToken(this.token);
        }
        this.error = null;
        this.isLoading = false;

        // Redirection vers /imc
        setTimeout(() => {
          this.router.navigate(['/imc']);
        }, 1000);
      },
      error: (err) => {
        this.error = err.error?.error || "Erreur lors de la connexion.";
        this.isLoading = false;
      }
    });
  }
}
