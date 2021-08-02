import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguratorConfirmedPreviewDialogComponent } from './configurator-confirmed-preview-dialog.component';

describe('ConfiguratorConfirmedPreviewDialogComponent', () => {
  let component: ConfiguratorConfirmedPreviewDialogComponent;
  let fixture: ComponentFixture<ConfiguratorConfirmedPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguratorConfirmedPreviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguratorConfirmedPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
