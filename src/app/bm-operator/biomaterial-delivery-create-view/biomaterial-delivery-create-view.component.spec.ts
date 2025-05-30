import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiomaterialDeliveryCreateViewComponent } from './biomaterial-delivery-create-view.component';

describe('BiomaterialDeliveryCreateViewComponent', () => {
  let component: BiomaterialDeliveryCreateViewComponent;
  let fixture: ComponentFixture<BiomaterialDeliveryCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiomaterialDeliveryCreateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiomaterialDeliveryCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
