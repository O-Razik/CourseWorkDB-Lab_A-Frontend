import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSubListViewComponent } from './generic-sub-list-view.component';

describe('GenericSubListViewComponent', () => {
  let component: GenericSubListViewComponent<any>;
  let fixture: ComponentFixture<GenericSubListViewComponent<any>>;

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
