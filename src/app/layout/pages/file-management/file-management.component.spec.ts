import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementComponent } from './file-management.component';

describe('MenuFileComponent', () => {
  let component: FileManagementComponent;
  let fixture: ComponentFixture<FileManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
