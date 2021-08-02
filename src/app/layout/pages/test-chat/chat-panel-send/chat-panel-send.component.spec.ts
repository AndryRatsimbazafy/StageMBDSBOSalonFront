import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPanelSendComponent } from './chat-panel-send.component';

describe('ChatPanelSendComponent', () => {
  let component: ChatPanelSendComponent;
  let fixture: ComponentFixture<ChatPanelSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatPanelSendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPanelSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
