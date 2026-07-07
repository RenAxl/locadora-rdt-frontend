import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API } from 'src/app/core/config/api.config';

import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call report endpoint with filters', () => {
    service
      .generate('receivables', 'pdf', {
        startDate: '2026-07-01',
        endDate: '2026-07-31',
        status: 'PAID',
        customerId: 1,
      })
      .subscribe();

    const request = httpMock.expectOne((req) => req.url === API.REPORTS.GENERATE('receivables', 'pdf'));
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('startDate')).toBe('2026-07-01');
    expect(request.request.params.get('endDate')).toBe('2026-07-31');
    expect(request.request.params.get('status')).toBe('PAID');
    expect(request.request.params.get('customerId')).toBe('1');
    request.flush(new Blob());
  });

  it('should call voucher endpoint', () => {
    service.voucher('payable', 2, 'xlsx').subscribe();

    const request = httpMock.expectOne(API.REPORTS.VOUCHER('payable', 2, 'xlsx'));
    expect(request.request.method).toBe('GET');
    request.flush(new Blob());
  });
});
