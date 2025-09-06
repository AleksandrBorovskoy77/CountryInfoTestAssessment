import { Component, OnDestroy } from '@angular/core';
import { CountryService } from '../country.service';
import { FormsModule } from '@angular/forms';
import { forkJoin, map, Subject, switchMap, takeUntil } from 'rxjs';
import { Country, CountryInfo } from '../country';
import { NgIf } from "@angular/common";
import { CountryHoliday } from '../holiday';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {

    private destroy$ = new Subject<void>();
    inputData: string = '';

    constructor(public countryService: CountryService) {
        
    }

    findCountry(): void {
        this.countryService.getCountryByCode(this.inputData).pipe(takeUntil(this.destroy$)).subscribe({
            next: (country) => {
                this.countryService.addCountry(country);
            }
        })

        this.inputData = '';
    }

    showData(): void {
        this.countryService.get3RandomCountries().pipe(takeUntil(this.destroy$), switchMap(countries => 
            forkJoin(countries.map(c => 
                this.countryService.getNextHolidayByCode(c.countryCode).pipe(
                    map(holiday => ({country: c, holiday}))
                )
            ))
        )).subscribe(result => {
            this.countryService.threeRandomCountries = result
                .map(res => ({countryName: res.country.name, holidayName: res.holiday.name, date: res.holiday.date}));
            
            this.countryService.showRandomCountries = true;
        })
    }

    deleteAll(): void {
        this.countryService.deleteAllContries();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
