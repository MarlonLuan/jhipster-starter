import { ICountry } from 'app/entities/country/country.model';

export interface IRegion {
  id: string;
  regionName?: string | null;
  country?: Pick<ICountry, 'id'> | null;
}

export type NewRegion = Omit<IRegion, 'id'> & { id: null };
