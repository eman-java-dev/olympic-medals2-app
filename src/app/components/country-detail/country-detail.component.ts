import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit {
  countryData?: Olympic;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(id)) {
      this.olympicService.getOlympics().subscribe((data) => {
        const found = data?.find((c) => c.id === id);
        if (found) {
          this.countryData = found;
        } else {
          console.error(`❌ Country with ID ${id} not found.`);
          // ✅ إعادة توجيه إلى صفحة 404
          this.router.navigate(['/not-found']);
        }
      }, (error) => {
        console.error('❌ Failed to load Olympic data', error);
        this.router.navigate(['/not-found']);
      });
    } else {
      // ✅ في حال لم يكن الـ ID رقمًا
      console.error('❌ Invalid country ID.');
      this.router.navigate(['/not-found']);
    }
  }
}
