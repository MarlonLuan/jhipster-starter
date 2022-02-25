import { IRegion } from 'app/entities/region/region.model';

export interface ICountry {
  id?: string;
  countryName?: string | null;
  region?: IRegion | null;
}

export class Country implements ICountry {
  constructor(public id?: string, public countryName?: string | null, public region?: IRegion | null) {}
}

export function getCountryIdentifier(country: ICountry): string | undefined {
  return country.id;
}
