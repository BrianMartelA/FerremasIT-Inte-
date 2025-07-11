import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoModalComponent } from './personal-info-modal.component';

describe('PersonalInfoModalComponent', () => {
  let component: PersonalInfoModalComponent;
  let fixture: ComponentFixture<PersonalInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalInfoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
