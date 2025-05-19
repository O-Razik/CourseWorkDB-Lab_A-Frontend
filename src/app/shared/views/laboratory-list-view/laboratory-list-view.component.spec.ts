import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryListViewComponent } from './laboratory-list-view.component';

describe('LaboratoryListViewComponent', () => {
  let component: LaboratoryListViewComponent;
  let fixture: ComponentFixture<LaboratoryListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratoryListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratoryListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
