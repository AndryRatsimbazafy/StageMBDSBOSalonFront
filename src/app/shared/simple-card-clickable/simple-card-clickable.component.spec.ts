import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleCardClickableComponent } from './simple-card-clickable.component';

describe('SimpleCardClickableComponent', () => {
  let component: SimpleCardClickableComponent;
  let fixture: ComponentFixture<SimpleCardClickableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleCardClickableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleCardClickableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
