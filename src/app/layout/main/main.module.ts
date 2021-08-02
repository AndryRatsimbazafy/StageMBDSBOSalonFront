import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../pages/login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '../layout.module';
import { HomeComponent } from '../pages/home/home.component';
import { AuthGuard } from '../../@core/guards/auth.guard';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ComponentModule } from 'src/app/@shared/component.module';
import { UsersComponent } from '../pages/users/users.component';
import { ConfiguratorComponent } from '../pages/configurator/configurator.component';
import { FileManagementComponent } from '../pages/file-management/file-management.component';
import { ContentManagerComponent } from '../pages/content-manager/content-manager.component';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';
import { ListeConfigurationComponent } from '../pages/liste-configuration/liste-configuration.component';
import { AvatarModule } from 'ngx-avatar';
import { RoleGuardService } from 'src/app/@core/guards/role.guard';
import { LiveChatComponent } from '../pages/live-chat/live-chat.component';
import {ReportingComponent} from '../pages/reporting/reporting.component';
import { TimerComponent } from '../pages/timer/timer.component';
import { TestChatComponent } from '../pages/test-chat/test-chat.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { pathMatch: 'full', path: '', redirectTo: 'configurator' },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard, RoleGuardService],
        data: {
          role: ['superadmin', 'admin', 'exposant'],
        },
      },
      {
        path: 'configurator',
        component: ConfiguratorComponent,
        canActivate: [AuthGuard, RoleGuardService],
        data: {
          role: ['superadmin', 'admin', 'exposant'],
        },
      },
      {
        path: 'file-management',
        component: FileManagementComponent,
        canActivate: [AuthGuard, RoleGuardService],
        data: {
          role: ['superadmin', 'admin', 'exposant'],
        },
      },
      {
        path: 'content-manager',
        component: ContentManagerComponent,
        canActivate: [AuthGuard, RoleGuardService],
        data: {
          role: ['superadmin'],
        },
      },
      {
        path: 'chat',
        component: LiveChatComponent,
        canActivate: [AuthGuard, RoleGuardService],
        data: {
          role: ['superadmin', 'commercial', 'coach'],
        },
      },
      {
        path: 'liste-configuration',
        component: ListeConfigurationComponent,
        canActivate: [AuthGuard, RoleGuardService],
        data: {
          role: ['superadmin', 'admin'],
        },
      },
      {
        path: 'reporting',
        component: ReportingComponent,
        canActivate: [AuthGuard, RoleGuardService],
        data: {
          role: ['superadmin', 'admin', 'exposant'],
        },
      },
      {
        path: 'timer',
        component: TimerComponent,
        canActivate: [AuthGuard, RoleGuardService],
        data: {
          role: ['superadmin'],
        },
      },
      {
        path: 'test-chat/:id',
        component: TestChatComponent
      }
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [],
  },
  {
    path: 'reset-user-password/:token',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(routes),
    MatSidenavModule,
    ComponentModule,
    PerfectScrollbarModule,
    AvatarModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  declarations: [MainComponent],
})
export class MainModule {}
