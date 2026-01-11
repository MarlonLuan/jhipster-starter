import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FormatMediumDatetimePipe } from 'app/shared/date';
import SharedModule from 'app/shared/shared.module';
import { IEmployee } from '../employee.model';

@Component({
  selector: 'jhi-employee-detail',
  templateUrl: './employee-detail.html',
  imports: [SharedModule, RouterLink, FormatMediumDatetimePipe],
})
export class EmployeeDetail {
  employee = input<IEmployee | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
