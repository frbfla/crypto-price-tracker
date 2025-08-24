import { Component, OnInit, OnDestroy, OnChanges, ElementRef, ViewChild, Input } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { PortfolioItem } from '../../services/portfolio.service';

Chart.register(...registerables);

@Component({
  selector: 'app-portfolio-chart',
  standalone: true,
  imports: [],
  templateUrl: './portfolio-chart.component.html',
  styleUrl: './portfolio-chart.component.scss'
})
export class PortfolioChartComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() portfolioData: PortfolioItem[] = [];
  
  private chart: Chart | null = null;

  ngOnInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  ngOnChanges(): void {
    if (this.chart && this.portfolioData.length > 0) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (this.portfolioData.length === 0) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chartData = this.prepareChartData();

    const config: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                return `${label}: ${value.toFixed(2)}%`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) {
      this.createChart();
      return;
    }

    const chartData = this.prepareChartData();
    this.chart.data = chartData;
    this.chart.update();
  }

  private prepareChartData() {
    const totalValue = this.portfolioData.reduce((sum, item) => sum + item.totalValue, 0);
    
    const labels = this.portfolioData.map(item => item.name);
    const data = this.portfolioData.map(item => {
      return totalValue > 0 ? (item.totalValue / totalValue) * 100 : 0;
    });
    
    const backgroundColors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#FF6384',
      '#C9CBCF'
    ];

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors.slice(0, this.portfolioData.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }
}
