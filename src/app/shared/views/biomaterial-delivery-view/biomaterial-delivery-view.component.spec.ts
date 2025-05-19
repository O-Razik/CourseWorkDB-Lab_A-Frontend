import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiomaterialDeliveryViewComponent } from './biomaterial-delivery-view.component';

describe('BiomaterialDeliveryViewComponent', () => {
  let component: BiomaterialDeliveryViewComponent;
  let fixture: ComponentFixture<BiomaterialDeliveryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiomaterialDeliveryViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiomaterialDeliveryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
