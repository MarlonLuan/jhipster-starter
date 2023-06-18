import { ICountry, NewCountry } from './country.model';

export const sampleWithRequiredData: ICountry = {
  id: '3c3f3185-997c-4a38-b3b9-744928a9db89',
};

export const sampleWithPartialData: ICountry = {
  id: '7117efa0-fc18-4796-99b5-be88a6ec40a7',
  countryName: 'culpa',
};

export const sampleWithFullData: ICountry = {
  id: '21f6d4ba-0145-479c-86f8-36a8e4c119f0',
  countryName: 'Liaison Soap indeed',
};

export const sampleWithNewData: NewCountry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
