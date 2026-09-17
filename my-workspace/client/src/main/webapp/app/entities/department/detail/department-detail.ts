import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IDepartment } from '../department.model';

@Component({
  selector: 'jhi-department-detail',
  templateUrl: './department-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class DepartmentDetail {
  readonly department = input<IDepartment | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
