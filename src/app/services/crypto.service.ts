import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private baseUrl = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista de criptomoedas com preços em USD
   * @param page Número da página
   * @param perPage Quantidade de itens por página
   * @returns Observable com a lista de criptomoedas
   */
  getCoins(page: number = 1, perPage: number = 20): Observable<any> {
    return this.http.get(`${this.baseUrl}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage.toString(),
        page: page.toString(),
        sparkline: 'false'
      }
    });
  }

  /**
   * Obtém detalhes de uma criptomoeda específica
   * @param id ID da criptomoeda
   * @returns Observable com os detalhes da criptomoeda
   */
  getCoinDetails(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/coins/${id}`);
  }

  /**
   * Obtém dados históricos de preço de uma criptomoeda
   * @param id ID da criptomoeda
   * @param days Número de dias para obter o histórico
   * @returns Observable com os dados históricos
   */
  getCoinHistory(id: string, days: number = 7): Observable<any> {
    return this.http.get(`${this.baseUrl}/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days.toString()
      }
    });
  }

  /**
   * Obtém as criptomoedas em tendência
   * @returns Observable com as criptomoedas em tendência
   */
  getTrendingCoins(): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/trending`);
  }
}
