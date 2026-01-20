import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private readonly olympicUrl = './assets/mock/olympic.json';

  // null = لم يتم التحميل بعد أو لا توجد بيانات بسبب خطأ
  private readonly olympics$ = new BehaviorSubject<Olympic[] | null>(null);

  // حالة الخطأ (false افتراضيًا)
  private readonly hasError$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((data: Olympic[]) => {
        this.olymicsNext(data);
        this.hasError$.next(false);
      }),
      catchError((error: unknown) => {
        console.error('Failed to load Olympic data:', error);
        this.olymicsNext(null);
        this.hasError$.next(true);
        return EMPTY;
      })
    );
  }

  // Getters
  getOlympics(): Observable<Olympic[] | null> {
    return this.olympics$.asObservable();
  }
  getHasError(): Observable<boolean> {
    return this.hasError$.asObservable();
  }
// Helper صغير لتفادي تكرار next
  private olymicsNext(data: Olympic[] | null): void {
    this.olympics$.next(data);
  }
}
