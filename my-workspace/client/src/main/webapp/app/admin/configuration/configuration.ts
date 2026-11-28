import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ConfigurationSection } from 'app/shared/jhipster/configuration.model';
import { LabelPipe, TranslateDirective } from 'app/shared/language';
import { SortByDirective, SortDirective, SortService, sortStateSignal } from 'app/shared/sort';

import { ConfigurationService } from './configuration.service';

@Component({
  selector: 'jhi-configuration',
  templateUrl: './configuration.html',
  imports: [FontAwesomeModule, SortDirective, SortByDirective, LabelPipe, TranslateDirective],
})
export default class Configuration implements OnInit {
  readonly allSections = signal<ConfigurationSection[] | undefined>(undefined);
  readonly filter = signal('');
  readonly sortState = sortStateSignal({ predicate: 'key', order: 'asc' });
  readonly sections = computed(() => {
    const filter = this.filter().toLowerCase();
    const { order, predicate } = this.sortState();
    return (this.allSections() ?? []).map(section => {
      const rows = section.rows.filter(row => row.key.toLowerCase().includes(filter));
      if (predicate && order) {
        rows.sort(this.sortService.startSort({ predicate, order }));
      }
      return { ...section, rows };
    });
  });

  private readonly sortService = inject(SortService);
  private readonly configurationService = inject(ConfigurationService);

  ngOnInit(): void {
    this.configurationService.getConfiguration().subscribe(sections => this.allSections.set(sections));
  }
}
