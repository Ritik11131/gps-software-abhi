import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyHomeSearchComponent } from './sky-home-search.component';

describe('SkyHomeSearchComponent', () => {
  let component: SkyHomeSearchComponent;
  let fixture: ComponentFixture<SkyHomeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkyHomeSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyHomeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
