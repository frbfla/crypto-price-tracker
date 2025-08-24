import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-coin-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coin-detail.component.html',
  styleUrl: './coin-detail.component.scss'
})
export class CoinDetailComponent implements OnInit {
  coinId: string = '';
  coin: any = null;
  loading: boolean = true;
  error: string | null = null;
  chartData: any[] = [];
  chartOptions: any = {};
  timeframe: string = '7d'; // Default timeframe

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.coinId = params['id'];
      this.loadCoinDetails();
      this.loadCoinHistory();
    });
  }

  loadCoinDetails(): void {
    this.loading = true;
    this.error = null;
    
    this.cryptoService.getCoinDetails(this.coinId).subscribe({
      next: (data) => {
        this.coin = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching coin details:', error);
        this.error = 'Não foi possível carregar os detalhes da criptomoeda. Por favor, tente novamente mais tarde.';
        this.loading = false;
      }
    });
  }

  loadCoinHistory(): void {
    let days = 7; // Default to 7 days
    
    if (this.timeframe === '24h') days = 1;
    else if (this.timeframe === '30d') days = 30;
    else if (this.timeframe === '1y') days = 365;
    
    this.cryptoService.getCoinHistory(this.coinId, days).subscribe({
      next: (data) => {
        this.chartData = this.processChartData(data.prices);
        this.setupChartOptions();
      },
      error: (error) => {
        console.error('Error fetching coin history:', error);
      }
    });
  }

  changeTimeframe(timeframe: string): void {
    this.timeframe = timeframe;
    this.loadCoinHistory();
  }

  processChartData(prices: any[]): any[] {
    return prices.map(price => {
      const date = new Date(price[0]);
      return {
        date: date,
        price: price[1]
      };
    });
  }

  setupChartOptions(): void {
    // Chart options would be set up here if using a charting library
    // For now, we'll just prepare the data
    console.log('Chart data ready:', this.chartData);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) {
      return (marketCap / 1e12).toFixed(2) + ' T';
    } else if (marketCap >= 1e9) {
      return (marketCap / 1e9).toFixed(2) + ' B';
    } else if (marketCap >= 1e6) {
      return (marketCap / 1e6).toFixed(2) + ' M';
    } else {
      return marketCap.toString();
    }
  }

  getColorClass(value: number): string {
    return value >= 0 ? 'positive-change' : 'negative-change';
  }

  goBack(): void {
    this.router.navigate(['/coin-list']);
  }
}
