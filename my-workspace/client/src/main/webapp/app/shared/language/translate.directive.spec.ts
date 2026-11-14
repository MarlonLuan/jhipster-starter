import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';

import TranslateDirective from './translate.directive';

@Component({
  imports: [TranslateDirective],
  template: `<div jhiTranslate="test"></div>`,
})
class TestTranslateDirective {}

describe('TranslateDirective Tests', () => {
  let fixture: ComponentFixture<TestTranslateDirective>;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
  });

  beforeEach(() => {
    translateService = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(TestTranslateDirective);
  });

  it('should change HTML', async () => {
    const spy = vi.spyOn(translateService, 'get');

    await fixture.whenStable();

    expect(spy).toHaveBeenCalled();
  });

  it('should keep the HTML when the translation fails', async () => {
    vi.spyOn(translateService, 'get').mockReturnValue(throwError(() => new Error('failed')));

    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('div').innerHTML).toBe('');
  });
});
