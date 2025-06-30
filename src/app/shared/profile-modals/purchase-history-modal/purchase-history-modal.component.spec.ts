import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseHistoryModalComponent } from './purchase-history-modal.component';

describe('PurchaseHistoryModalComponent', () => {
  let component: PurchaseHistoryModalComponent;
  let fixture: ComponentFixture<PurchaseHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseHistoryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
