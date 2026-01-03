import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';

import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit {

  // بيانات الدولة المختارة
  countryData?: Olympic;

  // KPI values (حسب الماكيت)
  totalEntries: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  // Line chart data (سطر واحد فقط)
  lineChartData: any[] = [];

  // حجم الرسم البياني
  view: [number, number] = [900, 420];

  // لون الرسم (سلسلة واحدة)
  colorScheme: Color = {
    name: 'countryLine',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#1aa6a8'],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const countryId = Number(idParam);

    // التحقق من صحة الـ id
    if (isNaN(countryId)) {
      this.router.navigate(['/not-found']);
      return;
    }

    // جلب البيانات
    this.olympicService.getOlympics().subscribe({
      next: (data) => {
        const country = data?.find((c) => c.id === countryId);

        if (!country) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.countryData = country;

        // حساب Number of entries
        this.totalEntries = country.participations.length;

        // حساب Total number of medals
        this.totalMedals = country.participations.reduce(
          (sum, p) => sum + p.medalsCount,
          0
        );

        // حساب Total number of athletes
        this.totalAthletes = country.participations.reduce(
          (sum, p) => sum + p.athleteCount,
          0
        );

        this.lineChartData = [
          {
            name: country.country,
            series: country.participations.map((p) => ({
              name: p.year.toString(),
              value: p.medalsCount,
            })),
          },
        ];
      },
      error: () => {
        this.router.navigate(['/not-found']);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
