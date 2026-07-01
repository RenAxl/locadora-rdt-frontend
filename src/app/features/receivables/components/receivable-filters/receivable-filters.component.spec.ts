import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ReceivableFiltersComponent } from './receivable-filters.component';
import { ReceivableQuickPeriodFilterComponent } from '../receivable-quick-period-filter/receivable-quick-period-filter.component';

describe('ReceivableFiltersComponent', () => {
  let component: ReceivableFiltersComponent;
  let fixture: ComponentFixture<ReceivableFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ReceivableFiltersComponent,
        ReceivableQuickPeriodFilterComponent,
      ],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceivableFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
