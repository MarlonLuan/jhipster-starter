import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ILocation } from '../location.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../location.test-samples';

import { LocationService } from './location.service';

const requireRestSample: ILocation = {
  ...sampleWithRequiredData,
};

describe('Location Service', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;
  let expectedResult: ILocation | ILocation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Location', () => {
      const location = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(location).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Location', () => {
      const location = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(location).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Location', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Location', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Location', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLocationToCollectionIfMissing', () => {
      it('should add a Location to an empty array', () => {
        const location: ILocation = sampleWithRequiredData;
        expectedResult = service.addLocationToCollectionIfMissing([], location);
        expect(expectedResult).toEqual([location]);
      });

      it('should not add a Location to an array that contains it', () => {
        const location: ILocation = sampleWithRequiredData;
        const locationCollection: ILocation[] = [
          {
            ...location,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLocationToCollectionIfMissing(locationCollection, location);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Location to an array that doesn't contain it", () => {
        const location: ILocation = sampleWithRequiredData;
        const locationCollection: ILocation[] = [sampleWithPartialData];
        expectedResult = service.addLocationToCollectionIfMissing(locationCollection, location);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(location);
      });

      it('should add only unique Location to an array', () => {
        const locationArray: ILocation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const locationCollection: ILocation[] = [sampleWithRequiredData];
        expectedResult = service.addLocationToCollectionIfMissing(locationCollection, ...locationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const location: ILocation = sampleWithRequiredData;
        const location2: ILocation = sampleWithPartialData;
        expectedResult = service.addLocationToCollectionIfMissing([], location, location2);
        expect(expectedResult).toEqual([location, location2]);
      });

      it('should accept null and undefined values', () => {
        const location: ILocation = sampleWithRequiredData;
        expectedResult = service.addLocationToCollectionIfMissing([], null, location, undefined);
        expect(expectedResult).toEqual([location]);
      });

      it('should return initial array if no Location is added', () => {
        const locationCollection: ILocation[] = [sampleWithRequiredData];
        expectedResult = service.addLocationToCollectionIfMissing(locationCollection, undefined, null);
        expect(expectedResult).toEqual(locationCollection);
      });
    });

    describe('compareLocation', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLocation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
        const entity2 = null;

        const compareResult1 = service.compareLocation(entity1, entity2);
        const compareResult2 = service.compareLocation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
        const entity2 = { id: 'a63537fe-865d-41e2-bc62-b6de781e4f03' };

        const compareResult1 = service.compareLocation(entity1, entity2);
        const compareResult2 = service.compareLocation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
        const entity2 = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };

        const compareResult1 = service.compareLocation(entity1, entity2);
        const compareResult2 = service.compareLocation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
