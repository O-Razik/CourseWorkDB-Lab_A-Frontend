import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryCreateViewComponent } from './laboratory-create-view.component';

describe('LaboratoryCreateViewComponent', () => {
  let component: LaboratoryCreateViewComponent;
  let fixture: ComponentFixture<LaboratoryCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratoryCreateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratoryCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
