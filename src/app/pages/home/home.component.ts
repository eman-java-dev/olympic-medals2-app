import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
type PieChartItem = { name: string; value: number };
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  olympics: Olympic[] = [];
  chartData: PieChartItem[] = [];
  barChartData: PieChartItem[] = [];
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  // default desktop size
  view: [number, number] = [700, 400];
  hasError = false;
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

  // لإغلاق الاشتراكات
  private readonly destroy$ = new Subject<void>();

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    // responsive chart size
    this.setChartView();
    // error state observable
    this.olympicService
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: boolean) => {
        this.hasError = error;
      });
    // data observable
    this.olympicService
      .getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Olympic[] | null) => {
        if (!data) {
          return;
        }
        this.olympics = data;
        this.loadChartData();
      });
  }
  @HostListener('window:resize')
  onResize(): void {
    this.setChartView();
  }
  private setChartView(): void {
    const width = window.innerWidth;

    if (width < 480) {
      this.view = [320, 260];
    } else if (width < 768) {
      this.view = [520, 320];
    } else {
      this.view = [700, 400];
    }
  }
  private loadChartData(): void {
    this.chartData = this.olympics.map((country: Olympic) => {
      const totalMedals = country.participations.reduce(
        (sum: number, p) => sum + p.medalsCount,
        0
      );
      return { name: country.country, value: totalMedals };
    });

    this.barChartData = [...this.chartData];
  }
  // بدل event:any
  onSelect(event: PieChartItem): void {
    const selectedCountry = this.olympics.find((c) => c.country === event.name);
    if (selectedCountry) {
      this.router.navigate(['/country', selectedCountry.id]);
    }
  }
  getCountryCode(countryName: string): string {
    const countryCodes: Record<string, string> = {
      Italy: 'it',
      Spain: 'es',
      'United States': 'us',
      Germany: 'de',
      France: 'fr',
    };
    return countryCodes[countryName] ?? 'us';
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
