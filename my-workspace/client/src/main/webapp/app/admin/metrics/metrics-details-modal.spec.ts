import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { provideTranslateService } from '@ngx-translate/core';

import { MetricDetails } from 'app/shared/jhipster/metrics.model';

import { MetricsDetailsModal } from './metrics-details-modal';

const details: MetricDetails = {
  label: { text: 'Details' },
  showLines: { text: 'Show' },
  hideLines: { text: 'Hide' },
  columns: [{ text: 'Column' }],
  filters: [
    { label: { text: 'All' }, count: 2, status: 'primary' },
    { label: { text: 'One' }, value: 'ONE', count: 1, status: 'success' },
  ],
  items: [
    { title: 'first', value: 'ONE', status: 'success', lines: ['a line'], cells: ['a cell'] },
    { title: 'second', value: 'TWO', status: 'danger', lines: [], cells: [] },
  ],
};

describe('MetricsDetailsModal', () => {
  let comp: MetricsDetailsModal;
  let fixture: ComponentFixture<MetricsDetailsModal>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService(), NgbActiveModal],
    });

    TestBed.inject(FaIconLibrary).addIcons(faCheck);
    fixture = TestBed.createComponent(MetricsDetailsModal);
    comp = fixture.componentInstance;
    comp.details = details;
  });

  it('should filter the items by value', () => {
    comp.selectedValue.set('ONE');

    expect(comp.items().map(({ title }) => title)).toEqual(['first']);
  });

  it('should filter the items by title', () => {
    comp.term.set('SECOND');

    expect(comp.items().map(({ title }) => title)).toEqual(['second']);
  });

  it('should show and hide the lines of an item', () => {
    comp.toggle('first');
    expect(comp.shownItems().has('first')).toBe(true);

    comp.toggle('first');
    expect(comp.shownItems().has('first')).toBe(false);
  });

  it('should render the items', async () => {
    await fixture.whenStable();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('h6 a')!.click();
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('a line');
    expect(text).toContain('a cell');
  });

  it('should filter and dismiss from the view', async () => {
    const dismiss = vi.spyOn(TestBed.inject(NgbActiveModal), 'dismiss');
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    Array.from(element.querySelectorAll<HTMLButtonElement>('button.badge'))
      .find(button => button.textContent.includes('One'))!
      .click();
    expect(comp.selectedValue()).toBe('ONE');

    const input = element.querySelector<HTMLInputElement>('#details-filter')!;
    input.value = 'first';
    input.dispatchEvent(new Event('input'));
    expect(comp.term()).toBe('first');

    element.querySelectorAll<HTMLButtonElement>('.btn-close, .modal-footer button').forEach(button => button.click());
    expect(dismiss).toHaveBeenCalledTimes(2);
  });

  it('should render nothing without details', async () => {
    comp.details = undefined;
    await fixture.whenStable();

    expect(comp.items()).toEqual([]);
    expect((fixture.nativeElement as HTMLElement).querySelector('h6')).toBeNull();
  });

  it('should dismiss the modal', () => {
    const dismiss = vi.spyOn(TestBed.inject(NgbActiveModal), 'dismiss');

    comp.dismiss();

    expect(dismiss).toHaveBeenCalled();
  });
});
