import { TableComponent } from './table/table.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoaderComponent } from 'src/utilities/loader/loader.component';
import { SortPipe } from 'src/utilities/pipes/sort.pipe';
import { RemoveDuplicatesPipe } from 'src/utilities/pipes/remove-duplicates.pipe';
import { MaterialModule } from './material.module';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { VideoPlayerComponent } from 'src/utilities/video-player/video-player.component';
import { DummyVideoComponent } from 'src/utilities/dummy-video/dummy-video.component';
import { SanitizePipe } from 'src/utilities/pipes/sanitize.pipe';
import { IncidentComponent } from './incident/incident.component';
import { SearchPipe } from 'src/utilities/pipes/search.pipe';
import { OrderByPipe } from 'src/utilities/pipes/order-by.pipe';
import { DeviceStatusComponent } from './device-status/device-status.component';
import { MatBadgeModule } from '@angular/material/badge';
import { SidepanelComponent } from './sidepanel/sidepanel.component';
import { CamerasComponent } from './cameras/cameras.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MonitoringHoursComponent } from './monitoring-hours/monitoring-hours.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ActiontagComponent } from './actiontag/actiontag.component';
import { ActionViewComponent } from './action-view/action-view.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatSliderModule } from '@angular/material/slider';
import { DayRangeSliderComponent } from './day-range-slider/day-range-slider.component';
import { TokenInterceptor } from 'src/interceptor/token.interceptor';
import { ImagePipe } from 'src/utilities/pipes/image.pipe';
import { PaginationComponent } from 'src/utilities/pagination/pagination.component';
import { MonitoringInfoComponent } from './monitoring-info/monitoring-info.component';
import { AlertsInfoComponent } from './alerts-info/alerts-info.component';
import { PlaybackInfoComponent } from './playback-info/playback-info.component';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import { LiveComponent } from 'src/utilities/live/live.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    DashboardComponent,
    IncidentComponent,
    LoaderComponent,
    VideoPlayerComponent,
    DummyVideoComponent,
    DeviceStatusComponent,
    SortPipe,
    SearchPipe,
    SanitizePipe,
    ImagePipe,
    RemoveDuplicatesPipe,
    OrderByPipe,
    SidepanelComponent,
    CamerasComponent,
    UserDashboardComponent,
    TableComponent,
    MonitoringHoursComponent,
    ActiontagComponent,
    ActionViewComponent,
    DayRangeSliderComponent,
    PaginationComponent,
    MonitoringInfoComponent,
    AlertsInfoComponent,
    PlaybackInfoComponent,
    EventsComponent,
    LiveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatBadgeModule,
    MatSliderModule,
    CommonModule,
    NgxMatTimepickerModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
