import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CountryDetailComponent } from './country-detail.component';

describe('Component Tests', () => {
  describe('Country Management Detail Component', () => {
    let comp: CountryDetailComponent;
    let fixture: ComponentFixture<CountryDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CountryDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ country: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
          },
        ],
      })
        .overrideTemplate(CountryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CountryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load country on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.country).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
      });
    });
  });
});
