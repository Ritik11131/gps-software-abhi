import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationManageComponent } from './notification-manage.component';

describe('NotificationManageComponent', () => {
  let component: NotificationManageComponent;
  let fixture: ComponentFixture<NotificationManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
