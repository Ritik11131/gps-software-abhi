import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerLibertiesComponent } from './reseller-liberties.component';

describe('ResellerLibertiesComponent', () => {
  let component: ResellerLibertiesComponent;
  let fixture: ComponentFixture<ResellerLibertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResellerLibertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResellerLibertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
