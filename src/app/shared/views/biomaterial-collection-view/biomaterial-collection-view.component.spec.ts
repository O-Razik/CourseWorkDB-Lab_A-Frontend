import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiomaterialCollectionViewComponent } from './biomaterial-collection-view.component';

describe('BiomaterialCollectionViewComponent', () => {
  let component: BiomaterialCollectionViewComponent;
  let fixture: ComponentFixture<BiomaterialCollectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiomaterialCollectionViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiomaterialCollectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
