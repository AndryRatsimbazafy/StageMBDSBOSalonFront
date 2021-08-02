import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {FooterMenuComponent} from './component/footer-menu/footer-menu.component';
import {SideMenuComponent} from './component/side-menu/side-menu.component';
import {MediaChatComponent} from './media-chat.component';
import {FormsModule} from '@angular/forms';
import {MediaChatStoreModule} from './store/media-chat-store.module';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AvatarModule} from 'ngx-avatar';
import {HttpClientModule} from '@angular/common/http';
import {MatChipsModule} from '@angular/material/chips';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import { CallingComponent } from './component/calling/calling.component';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    MediaChatComponent,
    FooterMenuComponent,
    SideMenuComponent,
    CallingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MediaChatStoreModule,
    MatBottomSheetModule,
    MatInputModule,
    MatFormFieldModule,
    AvatarModule,
    HttpClientModule,
    MatChipsModule,
    MatSnackBarModule,
    MatListModule,
    MatDialogModule,
    FlexLayoutModule
  ]
})
export class MediaChatModule { }
