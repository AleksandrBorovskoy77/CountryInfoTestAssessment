import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Country, CountryInfo } from './country';
import { map, Observable } from 'rxjs';
import { CountryHoliday, Holiday } from './holiday';

@Injectable({
    providedIn: 'root',
})
export class CountryService {
    private _countries: CountryInfo[] = [];
    private _threeRandomCountries: CountryHoliday[] = [];
    showRandomCountries: boolean = false;

    get countries(): CountryInfo[] {
        return this._countries;
    }

    get threeRandomCountries() : CountryHoliday[] {
        return this._threeRandomCountries;
    }

    set threeRandomCountries(value: CountryHoliday[]) {
        this._threeRandomCountries = [...value];
    }

    constructor(private http: HttpClient) {}

    addCountry(country: CountryInfo): void {
        this._countries.push(country);
    }

    deleteAllContries(): void {
        this._countries = [];
    }

    getCountryByCode(code: string): Observable<CountryInfo> {
        return this.http.get<CountryInfo>(
            environment.apiUrl + '/api/v3/countryinfo/' + code
        );
    }

    get3RandomCountries(): Observable<Country[]> {
        return this.http
            .get<Country[]>(environment.apiUrl + '/api/v3/availablecountries')
            .pipe(
                map((countries) =>
                    countries.sort(() => Math.random() - 0.5).slice(0, 3)
                )
            );
    }

    getNextHolidayByCode(code: string): Observable<Holiday> {
        return this.http
            .get<Holiday[]>(environment.apiUrl + '/api/v3/nextpublicholidays/' + code)
            .pipe(
                map(holidays => holidays[0])
            );
    }

    getHolidaysByCodeAndYear(code: string, year: number): Observable<Holiday[]> {
        return this.http
            .get<Holiday[]>(environment.apiUrl + '/api/v3/publicholidays/' + year + '/' + code);
    }
}
