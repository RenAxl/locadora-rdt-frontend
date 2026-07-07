import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { CustomerService } from 'src/app/features/customers/services/customer.service';
import { EmployeeService } from 'src/app/features/employees/services/employee.service';
import { PaymentMethodService } from 'src/app/features/payment-methods/services/payment-method.service';
import { SupplierService } from 'src/app/features/suppliers/services/supplier.service';
import { ReportService } from '../../services/report.service';
import { ReportListComponent } from './report-list.component';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;
  let reportService: jasmine.SpyObj<ReportService>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    reportService = jasmine.createSpyObj('ReportService', ['generate', 'voucher', 'download', 'openPdf']);
    messageService = jasmine.createSpyObj('MessageService', ['add']);

    const listService = jasmine.createSpyObj('ListService', ['list']);
    listService.list.and.returnValue(of({ content: [] }));

    await TestBed.configureTestingModule({
      declarations: [ReportListComponent],
      imports: [ReactiveFormsModule, ButtonModule],
      providers: [
        { provide: ReportService, useValue: reportService },
        { provide: MessageService, useValue: messageService },
        { provide: CustomerService, useValue: listService },
        { provide: SupplierService, useValue: listService },
        { provide: EmployeeService, useValue: listService },
        { provide: PaymentMethodService, useValue: listService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate pdf report', () => {
    reportService.generate.and.returnValue(of(new Blob()));

    component.generate('pdf');

    expect(reportService.generate).toHaveBeenCalledWith('receivables', 'pdf', jasmine.any(Object));
    expect(reportService.openPdf).toHaveBeenCalledWith(jasmine.any(Blob));
    expect(reportService.download).not.toHaveBeenCalled();
  });

  it('should download xlsx report', () => {
    reportService.generate.and.returnValue(of(new Blob()));

    component.generate('xlsx');

    expect(reportService.download).toHaveBeenCalledWith(jasmine.any(Blob), 'contas-a-receber.xlsx');
    expect(reportService.openPdf).not.toHaveBeenCalled();
  });

  it('should show message when dates are invalid', () => {
    component.form.patchValue({
      startDate: '2026-07-31',
      endDate: '2026-07-01',
    });

    component.generate('pdf');

    expect(reportService.generate).not.toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalled();
  });

  it('should show message when voucher account is empty', () => {
    component.generateVoucher('pdf');

    expect(reportService.voucher).not.toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalled();
  });

  it('should show error message when generation fails', () => {
    reportService.generate.and.returnValue(throwError(() => ({ error: { message: 'Erro teste' } })));

    component.generate('pdf');

    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ detail: 'Erro teste' }));
  });
});
