import { IRegion } from 'app/entities/region/region.model';
import { ILocation } from 'app/entities/location/location.model';

export interface ICountry {
  id: string;
  countryName?: string | null;
  region?: Pick<IRegion, 'id'> | null;
  location?: Pick<ILocation, 'id'> | null;
}

export type NewCountry = Omit<ICountry, 'id'> & { id: null };
