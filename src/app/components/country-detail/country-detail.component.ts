import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { LineChartSeries } from 'src/app/core/models/charts';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  countryData?: Olympic;
  totalEntries = 0;
  totalMedals = 0;
  totalAthletes = 0;
  lineChartData: LineChartSeries[] = [];
  // responsive view
  view: [number, number] = [900, 420];
  // line chart color
  colorScheme: Color = {
    name: 'countryLine',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#1aa6a8'],
  };
  private readonly destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}
  ngOnInit(): void {
    this.setChartView();
    const idParam = this.route.snapshot.paramMap.get('id');
    const countryId = Number(idParam);
    if (Number.isNaN(countryId)) {
      this.router.navigate(['/not-found']);
      return;
    }
    this.olympicService
      .getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Olympic[] | null) => {
        // إذا البيانات مازال ما تحمّلت / أو صار خطأ في التحميل
        if (!data) {
          this.router.navigate(['/not-found']);
          return;
        }
        const country = data.find((c: Olympic) => c.id === countryId);
        if (!country) {
          this.router.navigate(['/not-found']);
          return;
        }
        this.countryData = country;
        // KPIs
        this.totalEntries = country.participations.length;
        this.totalMedals = country.participations.reduce(
          (sum: number, p) => sum + p.medalsCount,
          0
        );
        this.totalAthletes = country.participations.reduce(
          (sum: number, p) => sum + p.athleteCount,
          0
        );
        // line chart data
        this.lineChartData = [
          {
            name: country.country,
            series: country.participations.map((p) => ({
              name: String(p.year),
              value: p.medalsCount,
            })),
          },
        ];
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
      this.view = [900, 420];
    }
  }
  goBack(): void {
    this.router.navigate(['/']);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
