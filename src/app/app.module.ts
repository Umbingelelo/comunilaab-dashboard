import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { PlaceModule } from './place/place.module';
import { InformationModule } from './information/information.module';
import { QrLocationModule } from './qr-location/qr-location.module';
import { HomeModule } from './home/home.module';
import { IdeasModule } from './ideas/ideas.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DashboardModule,
    AuthModule,
    SharedModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    UserModule,
    StoreModule,
    PlaceModule,
    QrLocationModule,
    InformationModule,
    HomeModule,
    IdeasModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
