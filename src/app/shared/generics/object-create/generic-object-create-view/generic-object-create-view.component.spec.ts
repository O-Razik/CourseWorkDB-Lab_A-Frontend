import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericObjectCreateViewComponent } from './generic-object-create-view.component';

describe('GenericObjectCreateViewComponent', () => {
  let component: GenericObjectCreateViewComponent;
  let fixture: ComponentFixture<GenericObjectCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericObjectCreateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericObjectCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
