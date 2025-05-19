import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericBpCreateViewComponent } from './generic-bp-create-view.component';

describe('GenericBpCreateViewComponent', () => {
  let component: GenericBpCreateViewComponent;
  let fixture: ComponentFixture<GenericBpCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericBpCreateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericBpCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
