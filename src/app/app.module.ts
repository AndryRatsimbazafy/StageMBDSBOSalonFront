import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainRoutingModule } from './main-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HomeComponent } from './layout/pages/home/home.component';
import { AuthAPIService } from './@core/service/auth.api.service';
import { AuthGuard } from './@core/guards/auth.guard';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { TokenInterceptor } from './@core/http-interceptors/token-interceptor';
import { LayoutModule } from './layout/layout.module';
import { AccountModule, ContentModule } from './@core/store';
import { UserReducer } from './@core/store/user/user.reducer';
import { UserEffects } from './@core/store/user/user.effect';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { SnackbarEffects } from './@core/store/snackbar/snackbar.effect';
import { snackbarReducer } from './@core/store/snackbar/snackbar.reducer';
import { AssetReducer } from './@core/store/asset/asset.reducer';
import { AssetEffects } from './@core/store/asset/asset.effect';
import { ContentEffects } from './@core/store/content/content.effect';
import { RoomEffects } from './@core/store/room/room.effect';
import { roomReducer } from './@core/store/room/room.reducer';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

const config: SocketIoConfig = { url: environment.CHAT_SERVER_URL, options: { autoConnect: false} }

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    MainRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    LayoutModule,
    AccountModule,
    StoreModule.forRoot({
      users: UserReducer,
      snackbar: snackbarReducer,
      assets: AssetReducer,
      rooms: roomReducer
    }),
    // Add ngrx debug
    StoreDevtoolsModule.instrument({
      logOnly: environment.production,
      maxAge: 25
    }),
    EffectsModule.forRoot([
      UserEffects,
      SnackbarEffects,
      AssetEffects,
      ContentEffects,
      RoomEffects
    ]),

    ContentModule,
    SocketIoModule.forRoot(config),
    NgxSkeletonLoaderModule.forRoot(),
  ],
  providers: [
    AuthAPIService,
    AuthGuard,
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
