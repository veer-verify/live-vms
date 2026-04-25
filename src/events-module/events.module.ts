import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent, FilePreviewPipe } from 'src/events-module/events/events.component';
import { SharedModule } from 'src/shared-module/shared.module';
import { AuthGuard } from 'src/utilities/auth.guard';
import { PlaybackInfoComponent } from './playback-info/playback-info.component';
import { LiveComponent } from './live/live.component';

const routes: Routes = [
  {
    path: 'pre-dispatch',
    component: EventsComponent,
    canDeactivate: [AuthGuard],
  },
  { path: 'dispatch', component: EventsComponent, canDeactivate: [AuthGuard] },
  { path: 'observer', component: EventsComponent, canDeactivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    EventsComponent,
    LiveComponent,
    PlaybackInfoComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FilePreviewPipe
],
})
export class EventsModule { }
