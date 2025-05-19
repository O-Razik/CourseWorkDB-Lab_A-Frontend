import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOrderCreateViewComponent } from './client-order-create-view.component';

describe('ClientOrderCreateViewComponent', () => {
  let component: ClientOrderCreateViewComponent;
  let fixture: ComponentFixture<ClientOrderCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientOrderCreateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientOrderCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
