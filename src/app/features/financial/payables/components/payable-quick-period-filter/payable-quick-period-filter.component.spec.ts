import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  PayableQuickPeriodFilterComponent,
  PayableQuickPeriodRange,
} from './payable-quick-period-filter.component';

describe('PayableQuickPeriodFilterComponent', () => {
  let component: PayableQuickPeriodFilterComponent;
  let fixture: ComponentFixture<PayableQuickPeriodFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayableQuickPeriodFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PayableQuickPeriodFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit current day when today is selected', () => {
    const today = new Date();
    const expectedDate = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, '0')}-${`${today.getDate()}`.padStart(2, '0')}`;
    let emittedRange: PayableQuickPeriodRange | undefined;

    component.periodChange.subscribe((range) => {
      emittedRange = range;
    });

    component.selectPeriod('TODAY');

    expect(emittedRange?.startDate).toBe(expectedDate);
    expect(emittedRange?.endDate).toBe(expectedDate);
  });
});
