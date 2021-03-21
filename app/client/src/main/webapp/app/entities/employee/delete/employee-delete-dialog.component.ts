import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmployee } from '../employee.model';
import { EmployeeService } from '../service/employee.service';

@Component({
  templateUrl: './employee-delete-dialog.component.html',
})
export class EmployeeDeleteDialogComponent {
  employee?: IEmployee;

  constructor(protected employeeService: EmployeeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.employeeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
