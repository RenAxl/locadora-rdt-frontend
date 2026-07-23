import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { PayableFiltersComponent } from './payable-filters.component';
import { PayableQuickPeriodFilterComponent } from '../payable-quick-period-filter/payable-quick-period-filter.component';

describe('PayableFiltersComponent', () => {
  let component: PayableFiltersComponent;
  let fixture: ComponentFixture<PayableFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PayableFiltersComponent,
        PayableQuickPeriodFilterComponent,
      ],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PayableFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
