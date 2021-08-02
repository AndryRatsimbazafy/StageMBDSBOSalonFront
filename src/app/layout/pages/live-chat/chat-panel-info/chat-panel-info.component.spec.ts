import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPanelInfoComponent } from './chat-panel-info.component';

describe('ChatPanelInfoComponent', () => {
  let component: ChatPanelInfoComponent;
  let fixture: ComponentFixture<ChatPanelInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatPanelInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPanelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
