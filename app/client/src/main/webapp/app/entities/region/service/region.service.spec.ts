import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRegion, Region } from '../region.model';

import { RegionService } from './region.service';

describe('Service Tests', () => {
  describe('Region Service', () => {
    let service: RegionService;
    let httpMock: HttpTestingController;
    let elemDefault: IRegion;
    let expectedResult: IRegion | IRegion[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RegionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        regionName: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Region', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Region()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Region', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            regionName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Region', () => {
        const patchObject = Object.assign({}, new Region());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Region', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            regionName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Region', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRegionToCollectionIfMissing', () => {
        it('should add a Region to an empty array', () => {
          const region: IRegion = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addRegionToCollectionIfMissing([], region);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(region);
        });

        it('should not add a Region to an array that contains it', () => {
          const region: IRegion = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const regionCollection: IRegion[] = [
            {
              ...region,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addRegionToCollectionIfMissing(regionCollection, region);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Region to an array that doesn't contain it", () => {
          const region: IRegion = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const regionCollection: IRegion[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addRegionToCollectionIfMissing(regionCollection, region);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(region);
        });

        it('should add only unique Region to an array', () => {
          const regionArray: IRegion[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: 'eb007032-5b65-490f-b346-cb4329317c01' },
          ];
          const regionCollection: IRegion[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addRegionToCollectionIfMissing(regionCollection, ...regionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const region: IRegion = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const region2: IRegion = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addRegionToCollectionIfMissing([], region, region2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(region);
          expect(expectedResult).toContain(region2);
        });

        it('should accept null and undefined values', () => {
          const region: IRegion = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addRegionToCollectionIfMissing([], null, region, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(region);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
