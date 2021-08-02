import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeConfigurationComponent } from './liste-configuration.component';

describe('ListeConfigurationComponent', () => {
  let component: ListeConfigurationComponent;
  let fixture: ComponentFixture<ListeConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
