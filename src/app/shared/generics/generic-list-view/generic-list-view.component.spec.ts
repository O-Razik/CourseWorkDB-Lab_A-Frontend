import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericListViewComponent } from './generic-list-view.component';

describe('GenericListViewComponent', () => {
  let component: GenericListViewComponent;
  let fixture: ComponentFixture<GenericListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
