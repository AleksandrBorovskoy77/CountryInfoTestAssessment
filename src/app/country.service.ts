import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Country, CountryInfo } from './country';
import { map, Observable } from 'rxjs';
import { Holiday } from './holiday';

@Injectable({
    providedIn: 'root',
})
export class CountryService {
    constructor(private http: HttpClient) {}

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
