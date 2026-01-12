import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkySearchControlComponent } from './sky-search-control.component';

describe('SkySearchControlComponent', () => {
  let component: SkySearchControlComponent;
  let fixture: ComponentFixture<SkySearchControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkySearchControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkySearchControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
