import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerComponent } from './reseller.component';

describe('ResellerComponent', () => {
  let component: ResellerComponent;
  let fixture: ComponentFixture<ResellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
