import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ImcComponent } from './components/imc/imc';
import { RegisterComponent } from './components/register/register';
import { HistoryComponent } from './components/history/history';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'imc', component: ImcComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'history', component: HistoryComponent },
  { path: '', redirectTo: '/imc', pathMatch: 'full' }
];
