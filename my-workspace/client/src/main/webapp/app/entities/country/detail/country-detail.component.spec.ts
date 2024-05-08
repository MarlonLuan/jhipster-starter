import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { CountryDetailComponent } from './country-detail.component';

describe('Country Management Detail Component', () => {
  let comp: CountryDetailComponent;
  let fixture: ComponentFixture<CountryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CountryDetailComponent,
              resolve: { country: () => of({ id: '9fec3727-3421-4967-b213-ba36557ca194' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CountryDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load country on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CountryDetailComponent);

      // THEN
      expect(instance.country()).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
