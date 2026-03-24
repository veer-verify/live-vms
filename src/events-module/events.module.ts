import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventsComponent } from "src/app/events/events.component";
import { MaterialModule } from "src/shared-module/shared.module";
import { AuthGuard } from "src/utilities/auth.guard";

const routes: Routes = [
    { path: 'pre-dispatch', component: EventsComponent, canDeactivate: [AuthGuard] },
    { path: 'dispatch', component: EventsComponent, canDeactivate: [AuthGuard] },
    { path: 'observer', component: EventsComponent, canDeactivate: [AuthGuard] },
]

@NgModule({
    declarations: [
        EventsComponent,
    ],
    imports: [
        MaterialModule,
        RouterModule.forChild(routes)
    ]
})

export class EventsModule { }