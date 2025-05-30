import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCreateViewComponent } from './client-create-view.component';

describe('ClientCreateViewComponent', () => {
  let component: ClientCreateViewComponent;
  let fixture: ComponentFixture<ClientCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCreateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
