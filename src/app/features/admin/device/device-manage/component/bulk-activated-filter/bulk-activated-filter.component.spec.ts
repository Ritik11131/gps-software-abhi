import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkActivatedFilterComponent } from './bulk-activated-filter.component';

describe('BulkActivatedFilterComponent', () => {
  let component: BulkActivatedFilterComponent;
  let fixture: ComponentFixture<BulkActivatedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkActivatedFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkActivatedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
