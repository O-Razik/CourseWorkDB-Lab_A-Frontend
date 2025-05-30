import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCreateViewComponent } from './employee-create-view.component';

describe('EmployeeCreateViewComponent', () => {
  let component: EmployeeCreateViewComponent;
  let fixture: ComponentFixture<EmployeeCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCreateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
