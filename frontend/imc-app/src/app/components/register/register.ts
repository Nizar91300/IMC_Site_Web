import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error: string | null = null;
  success: string | null = null;
  isLoading = false;

  constructor(private authService: AuthService) {}

  register() {
    if (this.isLoading) return; // évite les doubles clics

    // Vérification des champs vides
    if (!this.username || !this.email || !this.password) {
      this.error = "Tous les champs sont requis.";
      return;
    }

    // Vérification username (alphanumérique, longueur 3-30)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(this.username) || this.username.length < 3 || this.username.length > 30) {
      this.error = "Le nom d'utilisateur doit être alphanumérique (3-30 caractères).";
      return;
    }

    // Vérification email (format simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = "L'adresse email n'est pas valide.";
      return;
    }

    // Vérification mot de passe (min 6 caractères)
    if (this.password.length < 6) {
      this.error = "Le mot de passe doit contenir au moins 6 caractères.";
      return;
    }

    this.isLoading = true;

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.success = "Compte créé avec succès";
        this.error = null;
        this.isLoading = false;
        // Redirection à la page de connexion après un court délai
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      },
      error: (err) => {
        this.error = err.error.error || "Erreur lors de l'inscription.";
        this.success = null;
        this.isLoading = false;
      }
    });
  }
}
