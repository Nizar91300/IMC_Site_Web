import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ImcComponent } from './components/imc/imc';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'imc', component: ImcComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
