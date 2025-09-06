export interface Holiday {
    name: string,
    date: Date,
    types: string[]
}

export interface CountryHoliday {
    countryName: string,
    holidayName: string,
    date: Date
}