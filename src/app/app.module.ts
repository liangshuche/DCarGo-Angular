import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatDialogModule,
  MatCardModule,
  MatTabsModule,
  MatRadioModule,
  MatSnackBarModule,
  MatSliderModule,
  MatBadgeModule,
  MatTooltipModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CarRegisterComponent } from './car-register/car-register.component';
import { CarListComponent } from './car-list/car-list.component';
import { LayoutModule } from '@angular/cdk/layout';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { UserComponent } from './user/user.component';
import { RegisterPopoverComponent } from './user/register-popover/register-popover.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { CarDetailPopoverComponent } from './car-list/car-detail-popover/car-detail-popover.component';
import { DriveComponent } from './drive/drive.component';
import { NotificationCenterComponent } from './shared/notification-center/notification-center.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CarRegisterComponent,
    CarListComponent,
    NavigationComponent,
    UserComponent,
    RegisterPopoverComponent,
    SpinnerComponent,
    CarDetailPopoverComponent,
    DriveComponent,
    NotificationCenterComponent,
    // NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    NgbModule,
    LayoutModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatRadioModule,
    MatSnackBarModule,
    MatSliderModule,
    MatBadgeModule,
    MatTooltipModule,
    AgmCoreModule.forRoot({
      apiKey: null,
      language: 'zh-TW'
    })
  ],
  entryComponents: [
    RegisterPopoverComponent,
    CarDetailPopoverComponent,
    NotificationCenterComponent,
    SpinnerComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
