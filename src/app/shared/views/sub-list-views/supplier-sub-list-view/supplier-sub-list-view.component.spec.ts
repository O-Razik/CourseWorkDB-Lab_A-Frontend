import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSubListViewComponent } from './supplier-sub-list-view.component';

describe('SupplierSubListViewComponent', () => {
  let component: SupplierSubListViewComponent;
  let fixture: ComponentFixture<SupplierSubListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierSubListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierSubListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
