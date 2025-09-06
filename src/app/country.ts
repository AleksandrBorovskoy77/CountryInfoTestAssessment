export interface CountryInfo {
    commonName: string,
    officialName: string,
    countryCode: string,
    region: string,
    borders: CountryInfo[]
}

export interface Country {
    countryCode: string,
    name: string
}