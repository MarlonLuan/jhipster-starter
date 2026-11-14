import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { provideTranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';

import { fontAwesomeIcons } from 'app/config/font-awesome-icons';
import { ConfigurationSection } from 'app/shared/jhipster/configuration.model';

import Configuration from './configuration';
import { ConfigurationService } from './configuration.service';

describe('Configuration', () => {
  let comp: Configuration;
  let fixture: ComponentFixture<Configuration>;
  let service: ConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigurationService, provideTranslateService()],
    });
  });

  beforeEach(() => {
    TestBed.inject(FaIconLibrary).addIcons(...fontAwesomeIcons);
    fixture = TestBed.createComponent(Configuration);
    comp = fixture.componentInstance;
    service = TestBed.inject(ConfigurationService);
  });

  describe('OnInit', () => {
    it('should call load all on init', () => {
      // GIVEN
      const sections: ConfigurationSection[] = [
        {
          label: { text: 'beans' },
          columns: [{ text: 'Prefix' }, { text: 'Properties' }],
          rows: [
            { key: 'b', properties: [] },
            { key: 'a', properties: [] },
          ],
        },
        { label: { text: 'source' }, columns: [{ text: 'Property' }, { text: 'Value' }], rows: [{ key: 'port', value: '8080' }] },
      ];
      vi.spyOn(service, 'getConfiguration').mockReturnValue(of(sections));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.getConfiguration).toHaveBeenCalled();
      expect(comp.allSections()).toEqual(sections);
      expect(comp.sections()[0].rows.map(row => row.key)).toEqual(['a', 'b']);

      // WHEN
      comp.filter.set('PORT');

      // THEN
      expect(comp.sections().map(section => section.rows.length)).toEqual([0, 1]);
    });
  });

  describe('view', () => {
    const sections: ConfigurationSection[] = [
      {
        label: { text: 'Beans', translationKey: 'configuration.table.prefix' },
        columns: [{ text: 'Prefix', translationKey: 'configuration.table.prefix' }, { text: 'Properties' }],
        rows: [
          { key: 'beta', properties: [{ key: 'name', value: 'app' }] },
          { key: 'alpha', value: 'plain' },
        ],
      },
      {
        label: { text: 'Sources' },
        columns: [{ text: 'Property' }, { text: 'Value', translationKey: 'configuration.table.value' }],
        rows: [],
      },
    ];
    const keys = (): (string | null)[] =>
      Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('tbody tr td:first-child')).map(cell => cell.textContent.trim());

    beforeEach(async () => {
      vi.spyOn(service, 'getConfiguration').mockReturnValue(of(sections));
      await fixture.whenStable();
    });

    it('should render the sections', () => {
      const text = (fixture.nativeElement as HTMLElement).textContent;
      expect(text).toContain('configuration.table.prefix');
      expect(text).toContain('Properties');
      expect(text).toContain('app');
      expect(text).toContain('plain');
      expect(keys()).toEqual(['alpha', 'beta']);
    });

    it('should reverse the order and filter the rows', async () => {
      (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('th')!.click();
      await fixture.whenStable();
      expect(keys()).toEqual(['beta', 'alpha']);

      const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#configuration-filter')!;
      input.value = 'ALP';
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      expect(keys()).toEqual(['alpha']);
    });

    it('should keep the order of the rows without a sort', async () => {
      comp.sortState.set({});
      await fixture.whenStable();

      expect(keys()).toEqual(['beta', 'alpha']);
    });
  });

  it('should render nothing before the configuration loads', async () => {
    vi.spyOn(service, 'getConfiguration').mockReturnValue(EMPTY);
    await fixture.whenStable();

    expect(comp.sections()).toEqual([]);
    expect((fixture.nativeElement as HTMLElement).querySelector('h2')).toBeNull();
  });
});
