import { Routes } from '@angular/router';
import { CoinListComponent } from './components/coin-list/coin-list.component';
import { CoinDetailComponent } from './components/coin-detail/coin-detail.component';
import { LoginComponent } from './components/login/login.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { AddPortfolioItemComponent } from './components/add-portfolio-item/add-portfolio-item.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'coin-list', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'coin-list', component: CoinListComponent },
  { path: 'coin-detail/:id', component: CoinDetailComponent, canActivate: [authGuard] },
  { path: 'portfolio', component: PortfolioComponent},
  { path: 'portfolio/add', component: AddPortfolioItemComponent },
  { path: '**', redirectTo: 'coin-list' }
];
