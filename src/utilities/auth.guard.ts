import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EventsComponent } from 'src/app/events/events.component';
import { LoginService } from 'src/services/login.service';
import { StorageService } from 'src/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private loginSer: LoginService, private router: Router,private storage:StorageService) {



  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let isAuthenticated: boolean = this.loginSer.isLoggedin();
    if(!isAuthenticated) {
      this.router.navigate(['/login']);
    }
    return isAuthenticated;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return true;
  }

  canDeactivate(
    component: EventsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

  if (component?.eventData?.length !== 0 && component?.eventData) {
   
    return false;
  }

  return true;

  }

  canMatch(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
