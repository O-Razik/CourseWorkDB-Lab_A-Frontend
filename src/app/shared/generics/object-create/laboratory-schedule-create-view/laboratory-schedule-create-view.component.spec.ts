import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryScheduleCreateViewComponent } from './laboratory-schedule-create-view.component';

describe('LaboratoryScheduleCreateViewComponent', () => {
  let component: LaboratoryScheduleCreateViewComponent;
  let fixture: ComponentFixture<LaboratoryScheduleCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratoryScheduleCreateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratoryScheduleCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
