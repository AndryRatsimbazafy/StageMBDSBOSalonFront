import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguratorConfirmedComponent } from './configurator-confirmed.component';

describe('ConfiguratorConfirmedComponent', () => {
  let component: ConfiguratorConfirmedComponent;
  let fixture: ComponentFixture<ConfiguratorConfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguratorConfirmedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguratorConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
