import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiomaterialCollectionListViewComponent } from './biomaterial-collection-list-view.component';

describe('BiomaterialCollectionListViewComponent', () => {
  let component: BiomaterialCollectionListViewComponent;
  let fixture: ComponentFixture<BiomaterialCollectionListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiomaterialCollectionListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiomaterialCollectionListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
