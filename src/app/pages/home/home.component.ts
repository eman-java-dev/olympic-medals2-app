import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  olympics: Olympic[] = [];
  chartData: { name: string; value: number }[] = [];
  barChartData: { name: string; value: number }[] = [];

  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view: [number, number] = [700, 400];

  hasError: boolean = false;

  colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#647c8a',
      '#bccdcb',
      '#a1d6e2',
      '#1995ad',
      '#c3d7df',
      '#bcbabe',
      '#8d9db6',
      '#667292',
      '#001f4d',
      '#03396c',
    ],
  };

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olympicService.getHasError().subscribe((error) => {
      this.hasError = error;
    });

    this.olympicService.getOlympics().subscribe((data: Olympic[] | null | undefined) => {
      if (!data) {
        console.error('❌ Les données sont nulles');
        return;
      }

      this.olympics = data;
      this.loadChartData();
    });
  }

  loadChartData(): void {
    this.chartData = this.olympics.map((country) => {
      const totalMedals = country.participations.reduce(
        (sum, p) => sum + p.medalsCount,
        0
      );
      return {
        name: country.country,
        value: totalMedals,
      };
    });

    this.barChartData = [...this.chartData];
  }

  onSelect(event: any): void {
    const selectedCountry = this.olympics.find(
      (c) => c.country === event.name
    );
    if (selectedCountry) {
      this.router.navigate(['/country', selectedCountry.id]);
    }
  }

  getCountryCode(countryName: string): string {
    const countryCodes: { [key: string]: string } = {
      'Italy': 'it',
      'Spain': 'es',
      'United States': 'us',
      'Germany': 'de',
      'France': 'fr',
    };
    return countryCodes[countryName] || 'us';
  }
}
