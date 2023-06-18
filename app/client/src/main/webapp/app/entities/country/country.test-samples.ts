import { ICountry, NewCountry } from './country.model';

export const sampleWithRequiredData: ICountry = {
  id: 21844,
};

export const sampleWithPartialData: ICountry = {
  id: 20562,
  countryName: 'Car card Neutrois',
};

export const sampleWithFullData: ICountry = {
  id: 46690,
  countryName: 'Future indexing Handmade',
};

export const sampleWithNewData: NewCountry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
