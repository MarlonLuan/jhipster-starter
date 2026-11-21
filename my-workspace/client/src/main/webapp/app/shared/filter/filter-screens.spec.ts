import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { provideTranslateService } from '@ngx-translate/core';

import Filter from './filter';
import { FilterOption, FilterOptions } from './filter.model';

describe('Filter screens', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
    TestBed.inject(FaIconLibrary).addIconPacks(fas);
  });

  const render = async (filters: FilterOptions): Promise<ComponentFixture<Filter>> => {
    const fixture = TestBed.createComponent(Filter);
    fixture.componentRef.setInput('filters', filters);
    await fixture.whenStable();
    return fixture;
  };

  it('should show nothing without a filter', async () => {
    const fixture = await render(new FilterOptions());

    expect(fixture.nativeElement.querySelector('.filter-display')).toBeNull();
  });

  it('should clear a filter and all of them', async () => {
    const filters = new FilterOptions([new FilterOption('name', ['value', 'other'])]);
    const removeFilter = vi.spyOn(filters, 'removeFilter');
    const clear = vi.spyOn(filters, 'clear');
    const fixture = await render(filters);

    fixture.nativeElement.querySelector('li button').click();
    fixture.nativeElement.querySelector('.filter-display > button').click();

    expect(removeFilter).toHaveBeenCalledWith('name', 'value');
    expect(clear).toHaveBeenCalled();
  });
});
