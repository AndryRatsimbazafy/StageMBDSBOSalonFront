import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModule } from './pages/login/login.module';
import { MainModule } from './main/main.module';
import { UsersModule } from './pages/users/users.module';
import { ConfiguratorModule } from './pages/configurator/configurator.module';
import { FileManagementModule } from './pages/file-management/file-management.module';
import { ContentManagerModule } from './pages/content-manager/content-manager.module';
import { ListeConfigurationModule } from './pages/liste-configuration/liste-configuration.module';
import { LiveChatModule } from './pages/live-chat/live-chat.module';
import { ReportingComponent } from './pages/reporting/reporting.component';
import { TimerModule } from './pages/timer/timer.module';
import { ChatTestComponent } from './pages/chat-test/chat-test.component';
import { TestChatModule } from './pages/test-chat/test-chat.module';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [ReportingComponent],
  imports: [
    CommonModule,
    LoginModule,
    MainModule,
    UsersModule,
    ConfiguratorModule,
    FileManagementModule,
    ContentManagerModule,
    ListeConfigurationModule,
    LiveChatModule,
    TimerModule,
    TestChatModule,
    ChartsModule
  ],
})
export class LayoutModule {}
