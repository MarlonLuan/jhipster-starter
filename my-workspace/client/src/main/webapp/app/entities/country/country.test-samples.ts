import { ICountry, NewCountry } from './country.model';

export const sampleWithRequiredData: ICountry = {
  id: '0ddd0fdb-a1f3-42a8-b66c-b2136483a227',
};

export const sampleWithPartialData: ICountry = {
  id: 'a988f09b-2c94-48c3-ad55-979a218b2f15',
};

export const sampleWithFullData: ICountry = {
  id: '5ee5b1b4-4bc2-40e8-b595-601c2d1aed31',
  countryName: 'Planner Pizza',
};

export const sampleWithNewData: NewCountry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
