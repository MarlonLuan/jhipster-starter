import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LocationDetailComponent } from './location-detail.component';

describe('Location Management Detail Component', () => {
  let comp: LocationDetailComponent;
  let fixture: ComponentFixture<LocationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ location: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
        },
      ],
    })
      .overrideTemplate(LocationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LocationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load location on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.location).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
