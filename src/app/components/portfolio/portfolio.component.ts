import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioService, PortfolioItem } from '../../services/portfolio.service';
import { PortfolioChartComponent } from '../portfolio-chart/portfolio-chart.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule, PortfolioChartComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  portfolio: PortfolioItem[] = [];
  portfolioSummary = {
    totalValue: 0,
    totalInvested: 0,
    totalProfitLoss: 0,
    totalProfitLossPercentage: 0
  };
  loading = true;
  error = false;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.loadPortfolio();
    this.loadPortfolioSummary();
  }

  loadPortfolio(): void {
    this.loading = true;
    this.error = false;
    
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        this.portfolio = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar portfólio:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadPortfolioSummary(): void {
    this.portfolioService.getPortfolioSummary().subscribe({
      next: (summary) => {
        this.portfolioSummary = summary;
      },
      error: (err) => {
        console.error('Erro ao carregar resumo do portfólio:', err);
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  formatNumber(value: number, decimals: number = 8): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  retry(): void {
    this.loadPortfolio();
    this.loadPortfolioSummary();
  }
}
