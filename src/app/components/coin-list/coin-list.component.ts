import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../../services/crypto.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-coin-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './coin-list.component.html',
  styleUrl: './coin-list.component.scss'
})
export class CoinListComponent implements OnInit, OnDestroy {
  coins: any[] = [];
  filteredCoins: any[] = [];
  trendingCoins: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  searchTerms = new Subject<string>();
  private updateInterval: any;

  // Filtros
  sortBy: string = 'market_cap_desc';
  priceChangeFilter: string = 'all'; // all, positive, negative

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.loadCoins();
    this.loadTrendingCoins();

    // Configurar busca com debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.applyFilters();
    });

    // Configurar atualização automática a cada 30 segundos
    this.updateInterval = setInterval(() => {
      this.refreshData();
      console.log('Atualizando valores')
    }, 30000); // 30 segundos
  }

  ngOnDestroy(): void {
    // Limpar o interval quando o componente for destruído
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  loadCoins(): void {
    this.loading = true;
    this.cryptoService.getCoins().subscribe({
      next: (data) => {
        this.coins = data;
        this.filteredCoins = [...data];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados de criptomoedas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadTrendingCoins(): void {
    this.cryptoService.getTrendingCoins().subscribe({
      next: (data) => {
        this.trendingCoins = data.coins.slice(0, 5);
      },
      error: (err) => {
        console.error('Erro ao carregar criptomoedas em tendência:', err);
      }
    });
  }

  // Método para busca
  search(term: string): void {
    this.searchTerms.next(term);
  }

  // Aplicar todos os filtros
  applyFilters(): void {
    // Primeiro filtra por termo de busca
    let result = this.coins;

    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      result = result.filter(coin =>
        coin.name.toLowerCase().includes(searchTermLower) ||
        coin.symbol.toLowerCase().includes(searchTermLower)
      );
    }

    // Depois filtra por variação de preço
    if (this.priceChangeFilter !== 'all') {
      result = result.filter(coin => {
        const priceChange = coin.price_change_percentage_24h;
        if (this.priceChangeFilter === 'positive') {
          return priceChange > 0;
        } else {
          return priceChange < 0;
        }
      });
    }

    // Por fim, ordena
    result = this.sortCoins(result, this.sortBy);

    this.filteredCoins = result;
  }

  // Ordenar moedas
  sortCoins(coins: any[], sortBy: string): any[] {
    return [...coins].sort((a, b) => {
      switch (sortBy) {
        case 'market_cap_desc':
          return b.market_cap - a.market_cap;
        case 'market_cap_asc':
          return a.market_cap - b.market_cap;
        case 'price_desc':
          return b.current_price - a.current_price;
        case 'price_asc':
          return a.current_price - b.current_price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'change_desc':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'change_asc':
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        default:
          return b.market_cap - a.market_cap;
      }
    });
  }

  // Atualizar ordenação
  updateSort(sortBy: string): void {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  // Atualizar filtro de variação de preço
  updatePriceChangeFilter(filter: string): void {
    this.priceChangeFilter = filter;
    this.applyFilters();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)} T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)} B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)} M`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  }

  getColorClass(priceChange: number): string {
    return priceChange >= 0 ? 'positive-change' : 'negative-change';
  }

  // Método para atualizar dados sem mostrar loading
  refreshData(): void {
    this.cryptoService.getCoins().subscribe({
      next: (data) => {
        this.coins = data;
        this.applyFilters(); // Reaplicar filtros com os novos dados
      },
      error: (err) => {
        console.error('Erro ao atualizar dados de criptomoedas:', err);
      }
    });

    this.cryptoService.getTrendingCoins().subscribe({
      next: (data) => {
        this.trendingCoins = data.coins.slice(0, 5);
      },
      error: (err) => {
        console.error('Erro ao atualizar criptomoedas em tendência:', err);
      }
    });
  }
}
