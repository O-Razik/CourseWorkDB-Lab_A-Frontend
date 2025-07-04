import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientListViewComponent } from './client-list-view.component';

describe('ClientListViewComponent', () => {
  let component: ClientListViewComponent;
  let fixture: ComponentFixture<ClientListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
