import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveChatComponent } from './live-chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatUserComponent } from './chat-user/chat-user.component';
import { ChatPanelComponent } from './chat-panel/chat-panel.component';
import { AvatarModule } from 'ngx-avatar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ChatPanelInfoComponent } from './chat-panel-info/chat-panel-info.component';
import { ChatPanelSendComponent } from './chat-panel-send/chat-panel-send.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MediaChatModule } from './media-chat/media-chat.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentModule } from 'src/app/@shared/component.module';
import { CrystalLightboxModule } from '@crystalui/angular-lightbox';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    LiveChatComponent,
    ChatListComponent,
    ChatUserComponent,
    ChatPanelComponent,
    ChatPanelInfoComponent,
    ChatPanelSendComponent,
  ],
  imports: [
    CommonModule,
    AvatarModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    PickerModule,
    MediaChatModule,
    MatDialogModule,
    ComponentModule,
    CrystalLightboxModule,
    NgxSkeletonLoaderModule,
    MatSnackBarModule
  ],
})
export class LiveChatModule {}
