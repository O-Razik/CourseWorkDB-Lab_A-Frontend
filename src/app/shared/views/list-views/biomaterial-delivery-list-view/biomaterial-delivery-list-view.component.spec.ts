import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiomaterialDeliveryListViewComponent } from './biomaterial-delivery-list-view.component';

describe('BiomaterialDeliveryListViewComponent', () => {
  let component: BiomaterialDeliveryListViewComponent;
  let fixture: ComponentFixture<BiomaterialDeliveryListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiomaterialDeliveryListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiomaterialDeliveryListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
