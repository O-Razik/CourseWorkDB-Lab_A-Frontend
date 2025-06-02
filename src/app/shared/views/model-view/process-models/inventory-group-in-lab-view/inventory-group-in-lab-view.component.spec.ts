import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryGroupInLabViewComponent } from './inventory-group-in-lab-view.component';

describe('InventoryGroupInLabViewComponent', () => {
  let component: InventoryGroupInLabViewComponent;
  let fixture: ComponentFixture<InventoryGroupInLabViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryGroupInLabViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryGroupInLabViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
