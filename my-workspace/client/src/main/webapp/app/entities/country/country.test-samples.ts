import { ICountry, NewCountry } from './country.model';

export const sampleWithRequiredData: ICountry = {
  id: 'fdc879a8-22a2-4576-a8ea-f6ecd3b8bffb',
};

export const sampleWithPartialData: ICountry = {
  id: '9cc45373-0234-44db-939c-9d55d016272d',
  countryName: 'phooey dreamily calmly',
};

export const sampleWithFullData: ICountry = {
  id: 'db413a1d-367f-406b-a380-c1fa201a845d',
  countryName: 'wedge enlightened',
};

export const sampleWithNewData: NewCountry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
