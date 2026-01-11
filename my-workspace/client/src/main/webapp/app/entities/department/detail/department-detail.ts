import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IDepartment } from '../department.model';

@Component({
  selector: 'jhi-department-detail',
  templateUrl: './department-detail.html',
  imports: [SharedModule, RouterLink],
})
export class DepartmentDetail {
  department = input<IDepartment | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
