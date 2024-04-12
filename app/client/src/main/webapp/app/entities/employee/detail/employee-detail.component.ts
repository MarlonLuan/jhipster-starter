import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IEmployee } from '../employee.model';

@Component({
  standalone: true,
  selector: 'jhi-employee-detail',
  templateUrl: './employee-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EmployeeDetailComponent {
  employee = input<IEmployee | null>(null);

  previousState(): void {
    window.history.back();
  }
}
