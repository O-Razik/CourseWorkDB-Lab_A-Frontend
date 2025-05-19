import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IManagerDashboardComponent } from './i-manager-dashboard.component';

describe('IManagerDashboardComponent', () => {
  let component: IManagerDashboardComponent;
  let fixture: ComponentFixture<IManagerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IManagerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IManagerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
