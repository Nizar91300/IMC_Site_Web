import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  username = '';
  password = '';
  token: string | null = null;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.token = res.token;
        if (this.token) {
          localStorage.setItem('token', this.token);
        }
        this.error = null;
      },
      error: () => {
        this.error = "Identifiants invalides.";
      }
    });
  }
}
