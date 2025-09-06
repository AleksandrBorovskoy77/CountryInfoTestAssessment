import { Component, computed, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Holiday } from '../holiday';
import { CountryService } from '../country.service';
import { Subject, pipe, takeUntil } from 'rxjs';

@Component({
    selector: 'app-country',
    imports: [],
    templateUrl: './country.component.html',
    styleUrl: './country.component.scss',
})
export class CountryComponent implements OnDestroy {

    countryCode: string | null;
    countryName: string | null;
    holidays: Holiday[] = [];
    currentYear = new Date().getFullYear();
    selectedYear = signal(this.currentYear);

    private destroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute,
        private countryService: CountryService
    ) {
        this.countryCode = this.route.snapshot.paramMap.get('code');
        this.countryName = this.route.snapshot.queryParamMap.get('name');

        effect(() => {
            this.countryService.getHolidaysByCodeAndYear(this.countryCode!, this.selectedYear())
            .pipe(takeUntil(this.destroy$)).subscribe({
                next: (holidays) => {
                    this.holidays = holidays;
                } 
            })  
        })
    }

    decrease(): void {
        this.selectedYear.update(v => --v);
    }

    increase(): void {
        this.selectedYear.update(v => ++v);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
