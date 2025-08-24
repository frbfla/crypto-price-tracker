import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  image: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor() { }

  // Dados simulados do portfólio do usuário
  private mockPortfolioData: PortfolioItem[] = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      quantity: 0.5,
      averagePrice: 45000,
      currentPrice: 52000,
      totalValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      quantity: 2.5,
      averagePrice: 2800,
      currentPrice: 3200,
      totalValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      quantity: 1000,
      averagePrice: 0.8,
      currentPrice: 0.65,
      totalValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      quantity: 10,
      averagePrice: 120,
      currentPrice: 180,
      totalValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    },
    {
      id: 'chainlink',
      name: 'Chainlink',
      symbol: 'LINK',
      image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
      quantity: 50,
      averagePrice: 25,
      currentPrice: 22,
      totalValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    }
  ];

  getPortfolio(): Observable<PortfolioItem[]> {
    // Calcular valores totais, lucro/prejuízo para cada item
    const calculatedPortfolio = this.mockPortfolioData.map(item => {
      const totalValue = item.quantity * item.currentPrice;
      const totalInvested = item.quantity * item.averagePrice;
      const profitLoss = totalValue - totalInvested;
      const profitLossPercentage = ((item.currentPrice - item.averagePrice) / item.averagePrice) * 100;

      return {
        ...item,
        totalValue,
        profitLoss,
        profitLossPercentage
      };
    });

    return of(calculatedPortfolio);
  }

  getPortfolioSummary(): Observable<{
    totalValue: number;
    totalInvested: number;
    totalProfitLoss: number;
    totalProfitLossPercentage: number;
  }> {
    return new Observable(observer => {
      this.getPortfolio().subscribe(portfolio => {
        const totalValue = portfolio.reduce((sum, item) => sum + item.totalValue, 0);
        const totalInvested = portfolio.reduce((sum, item) => sum + (item.quantity * item.averagePrice), 0);
        const totalProfitLoss = totalValue - totalInvested;
        const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

        observer.next({
          totalValue,
          totalInvested,
          totalProfitLoss,
          totalProfitLossPercentage
        });
        observer.complete();
      });
    });
  }
}
