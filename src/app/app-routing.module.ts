import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'src/utilities/auth.guard';
import { DeviceStatusComponent } from './device-status/device-status.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MonitoringInfoComponent } from './monitoring-info/monitoring-info.component';
import { AlertsInfoComponent } from './alerts-info/alerts-info.component';
import { PlaybackInfoComponent } from './playback-info/playback-info.component';
import { EventsComponent } from './events/events.component';
import { NvrComponent } from './nvr/nvr.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: 'monitoring-info', component: MonitoringInfoComponent },
      { path: 'alerts-info', component: AlertsInfoComponent },
      { path: 'playback-info', component: PlaybackInfoComponent },
      { path: 'device-status', component: DeviceStatusComponent },
      { path: 'nvr', component: NvrComponent },
      { path: 'pre-dispatch', component: EventsComponent, canDeactivate: [AuthGuard] },
      { path: 'dispatch', component: EventsComponent, canDeactivate: [AuthGuard] },
      { path: 'observer', component: EventsComponent, canDeactivate: [AuthGuard] },
      { path: '', redirectTo: '/user-dashboard/monitoring-info', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
