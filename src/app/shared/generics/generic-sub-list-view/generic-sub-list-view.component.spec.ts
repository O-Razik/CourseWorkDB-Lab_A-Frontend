import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSubListViewComponent } from './generic-sub-list-view.component';

describe('GenericSubListViewComponent', () => {
  let component: GenericSubListViewComponent;
  let fixture: ComponentFixture<GenericSubListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericSubListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericSubListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
