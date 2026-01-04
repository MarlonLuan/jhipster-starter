import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { RegionService } from '../service/region.service';

import { RegionDeleteDialog } from './region-delete-dialog';

describe('Region Management Delete Component', () => {
  let comp: RegionDeleteDialog;
  let fixture: ComponentFixture<RegionDeleteDialog>;
  let service: RegionService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal],
    });
    fixture = TestBed.createComponent(RegionDeleteDialog);
    comp = fixture.componentInstance;
    service = TestBed.inject(RegionService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('should call delete service on confirmDelete', () => {
      // GIVEN
      vitest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));
      vitest.spyOn(mockActiveModal, 'close');

      // WHEN
      comp.confirmDelete('9fec3727-3421-4967-b213-ba36557ca194');

      // THEN
      expect(service.delete).toHaveBeenCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
      expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
    });

    it('should not call delete service on clear', () => {
      // GIVEN
      vitest.spyOn(service, 'delete');
      vitest.spyOn(mockActiveModal, 'close');
      vitest.spyOn(mockActiveModal, 'dismiss');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
