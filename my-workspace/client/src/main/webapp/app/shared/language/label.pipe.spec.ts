import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TranslateService, provideTranslateService } from '@ngx-translate/core';

import LabelPipe from './label.pipe';

describe('LabelPipe', () => {
  let pipe: LabelPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService(), LabelPipe, { provide: ChangeDetectorRef, useValue: { markForCheck() {} } }],
    });
    const translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', { known: 'Translated' });
    translateService.use('en');
    pipe = TestBed.inject(LabelPipe);
  });

  it('should give the text of a label without a key', () => {
    expect(pipe.transform({ text: 'Text' })).toBe('Text');
  });

  it('should translate the key of a label', () => {
    expect(pipe.transform({ text: 'Text', translationKey: 'known' })).toBe('Translated');
  });

  it('should give the text of a key without a translation', () => {
    expect(pipe.transform({ text: 'Text', translationKey: 'unknown' })).toBe('Text');
  });
});
