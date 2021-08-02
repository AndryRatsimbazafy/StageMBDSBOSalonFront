import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCheckableComponent } from './card-checkable.component';

describe('CardCheckableComponent', () => {
  let component: CardCheckableComponent;
  let fixture: ComponentFixture<CardCheckableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardCheckableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCheckableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
