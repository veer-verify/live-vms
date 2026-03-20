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
import { SidepanelComponent } from './sidepanel/sidepanel.component';
import { CamerasComponent } from './cameras/cameras.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MonitoringHoursComponent } from './monitoring-hours/monitoring-hours.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ActiontagComponent } from './actiontag/actiontag.component';
import { ActionViewComponent } from './action-view/action-view.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { DayRangeSliderComponent } from './day-range-slider/day-range-slider.component';
import { ImagePipe } from 'src/utilities/pipes/image.pipe';
import { PaginationComponent } from 'src/utilities/pagination/pagination.component';
import { MonitoringInfoComponent } from './monitoring-info/monitoring-info.component';
import { AlertsInfoComponent } from './alerts-info/alerts-info.component';
import { PlaybackInfoComponent } from './playback-info/playback-info.component';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import { LiveComponent } from 'src/utilities/live/live.component';
import { StatusComponent } from 'src/utilities/status/status.component';
import { TableComponent } from '../utilities/table/table.component';
import { TemplateComponent } from './template/template.component';
import { TextAndNumberOnlyDirective } from 'src/utilities/pipes/text-and-number-only.directive';
import { TokenInterceptor } from 'src/utilities/token.interceptor';
import { TextonlyDirective } from 'src/utilities/pipes/textonly.directive';
import { NvrComponent } from './nvr/nvr.component';
import { CountPipe } from 'src/utilities/pipes/count.pipe';
import { PlannedsiteComponent } from './plannedsite/plannedsite.component';
import { SitesettingsComponent } from './sitesettings/sitesettings.component';
import { ManualprocessComponent } from './manualprocess/manualprocess/manualprocess.component';

import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { InsightsComponent } from './insights/insights.component';
import { SiteMapComponent } from './insights/site-map/site-map.component';
import { AgGridAngular } from 'ag-grid-angular';
import { AgCharts } from 'ag-charts-angular';
import { CameraInsightsComponent } from './insights/camera-insights/camera-insights.component';
import { SitesComponent } from './sites/sites.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { AddNewCameraComponent } from './add-new-camera/add-new-camera.component';
import { AddNewEventComponent } from './add-new-event/add-new-event.component';
import { AddNewInstallationComponent } from './add-new-installation/add-new-installation.component';
import { AddNewSiteComponent } from './add-new-site/add-new-site.component';
import { CountryStateCityComponent } from './country-state-city/country-state-city.component';
import { EditCameraComponent } from './edit-camera/edit-camera.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { AddDeviceFormComponent } from './add-device-form/add-device-form.component';
import { EditDeviceFormComponent } from './edit-device-form/edit-device-form.component';
import { DevicesComponent } from './devices/devices.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { CameraTransferComponent } from './camera-transfer/camera-transfer.component';
import { DeviceInfoComponent } from './devices/device-info/device-info.component';
import { AddNewDeviceComponent } from './add-new-device/add-new-device.component';
import { MgmttableComponent } from './mgmttable/mgmttable.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { SigninComponent } from './signin/signin.component';

ModuleRegistry.registerModules([
  AllCommunityModule,
]);

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
    LiveComponent,
    StatusComponent,
    TemplateComponent,
    TextAndNumberOnlyDirective,
    TextonlyDirective,
    NvrComponent,
    CountPipe,
    PlannedsiteComponent,
    SitesettingsComponent,
    ManualprocessComponent,
    InsightsComponent,
    SiteMapComponent,
    CameraInsightsComponent,
    SitesComponent,
    AddDeviceComponent,
    AddNewCameraComponent,
    AddNewEventComponent,
    AddNewInstallationComponent,
    AddNewSiteComponent,
    CountryStateCityComponent,
    EditCameraComponent,
    CreateFormComponent,
    AddDeviceFormComponent,
    EditDeviceFormComponent,
    DevicesComponent,
    CameraTransferComponent,
    DeviceInfoComponent,
    AddNewDeviceComponent,
    MgmttableComponent,
    EditFormComponent,
    LoaderComponent,
    SigninComponent
  ],
  imports: [
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    CommonModule,
    NgxMatTimepickerModule,
    AgGridAngular,
    AgCharts,
    NgCircleProgressModule,

    // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 6,
      innerStrokeWidth: 2,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
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
