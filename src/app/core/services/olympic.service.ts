import { Olympic } from '../models/Olympic';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  private olympics$ = new BehaviorSubject<Olympic[] | null | undefined>(undefined);
  private hasError$ = new BehaviorSubject<boolean>(false); // ✅ حالة الخطأ

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((data) => {
        this.olympics$.next(data);
        this.hasError$.next(false); // تم التحميل بنجاح
      }),
      catchError((error) => {
        console.error('❌ Failed to load Olympics data:', error);
        this.olympics$.next(null); // إبلاغ باقي المشروع بعدم توفر البيانات
        this.hasError$.next(true); // تم حدوث خطأ
        return EMPTY;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getHasError() {
    return this.hasError$.asObservable();
  }
}
