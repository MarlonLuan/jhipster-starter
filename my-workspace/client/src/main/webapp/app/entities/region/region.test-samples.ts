import { IRegion, NewRegion } from './region.model';

export const sampleWithRequiredData: IRegion = {
  id: 'aa7d632a-9a7a-4274-bb5f-5d63d109ca88',
};

export const sampleWithPartialData: IRegion = {
  id: 'f9ebc996-da81-498e-a62e-0194a94d5494',
  regionName: 'yesterday dispense',
};

export const sampleWithFullData: IRegion = {
  id: 'f347f590-0453-4974-a82f-c0d2aebae169',
  regionName: 'breakable sophisticated whine',
};

export const sampleWithNewData: NewRegion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
