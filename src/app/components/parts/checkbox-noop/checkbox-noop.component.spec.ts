import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxNoopComponent } from './checkbox-noop.component';

describe('CheckboxNoopComponent', () => {
  let component: CheckboxNoopComponent;
  let fixture: ComponentFixture<CheckboxNoopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxNoopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxNoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
