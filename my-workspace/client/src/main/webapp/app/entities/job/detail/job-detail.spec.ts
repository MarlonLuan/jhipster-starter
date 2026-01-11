import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { JobDetail } from './job-detail';

describe('Job Management Detail Component', () => {
  let comp: JobDetail;
  let fixture: ComponentFixture<JobDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./job-detail').then(m => m.JobDetail),
              resolve: { job: () => of({ id: 'fe5fddd6-1eb2-44f0-b155-6defcd44ea6c' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    });
    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faArrowLeft);
    library.addIcons(faPencilAlt);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetail);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load job on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JobDetail);

      // THEN
      expect(instance.job()).toEqual(expect.objectContaining({ id: 'fe5fddd6-1eb2-44f0-b155-6defcd44ea6c' }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(globalThis.history.back).toHaveBeenCalled();
    });
  });
});
