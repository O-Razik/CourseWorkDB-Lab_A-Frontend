import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IManagerPageComponent } from './i-manager-page.component';

describe('IManagerPageComponent', () => {
  let component: IManagerPageComponent;
  let fixture: ComponentFixture<IManagerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IManagerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IManagerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
