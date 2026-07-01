import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableQuickPeriodFilterComponent } from './receivable-quick-period-filter.component';

describe('ReceivableQuickPeriodFilterComponent', () => {
  let component: ReceivableQuickPeriodFilterComponent;
  let fixture: ComponentFixture<ReceivableQuickPeriodFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceivableQuickPeriodFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceivableQuickPeriodFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit current day when today is selected', () => {
    const today = new Date();
    const expectedDate = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, '0')}-${`${today.getDate()}`.padStart(2, '0')}`;
    let emittedStartDate: string | null = null;
    let emittedEndDate: string | null = null;

    component.periodChange.subscribe((range) => {
      emittedStartDate = range.startDate;
      emittedEndDate = range.endDate;
    });

    component.selectPeriod('TODAY');

    expect(emittedStartDate).toBe(expectedDate);
    expect(emittedEndDate).toBe(expectedDate);
  });
});
