import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppointments } from './edit-appointments';

describe('EditAppointments', () => {
  let component: EditAppointments;
  let fixture: ComponentFixture<EditAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAppointments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAppointments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
