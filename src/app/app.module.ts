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
  MatDialogModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
  ],
  entryComponents: [
    RegisterPopoverComponent,
    SpinnerComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
