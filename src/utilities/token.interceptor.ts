// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
// import { Router } from '@angular/router';
// import { StorageService } from 'src/services/storage.service';
// import { LoginService } from 'src/services/login.service';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {

//   private isRefreshing = false;
//   private refreshTokenSubject = new BehaviorSubject<any>(null);

//   constructor(
//     private router: Router,
//     private authSer: LoginService,
//     private storageService: StorageService
//   ) { }

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     let session = this.storageService.getData('session');

//     if (
//       session?.AccessToken &&
//       !request.url.startsWith('https://api.800.com')
//     )
//     {
//       request = this.addToken(request, session.AccessToken);
//     }

//     return next.handle(request).pipe(catchError(error => {
//         if (error instanceof HttpErrorResponse && error.status === 401 )  {
//           return this.handle401Error(request, next);
//         } else {
//           return throwError(() => {
//             console.log('error')
//           });
//         }
//       })
//     );
//   }


//   private addToken(request: HttpRequest<any>, token: string) {
//     return request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }



//   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//     let session = this.storageService.getData('session');

//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       // this.storageService.loader_sub.next(true);
//       return this.authSer.getAccessforRefreshToken(session).pipe(
//         switchMap((res: any) => {
//           // this.storageService.loader_sub.next(false);
//           session.AccessToken = res.access_token;
//           this.storageService.saveData('session', session);
//           this.isRefreshing = false;
//           this.refreshTokenSubject.next(res.access_token);
//           return next.handle(this.addToken(request, res.access_token));
//         }),
//         catchError((err) => {
//           // this.storageService.loader_sub.next(false);
//           this.isRefreshing = false;
//           this.authSer.logout();
//           return throwError(() => err);
//         })
//       );
//     } else {
//       return this.refreshTokenSubject.pipe(
//         filter(token => token != null),
//         take(1),
//         switchMap(accessToken => {
//           return next.handle(this.addToken(request, accessToken));
//         })
//       );
//     }
//   }
// }







import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
  fromEvent
} from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from 'src/services/storage.service';
import { LoginService } from 'src/services/login.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private authSer: LoginService,
    private storageService: StorageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const session = this.storageService.getData('session');

    if (
      session?.AccessToken &&
      !request.url.startsWith('https://api.800.com')
    ) {
      request = this.addToken(request, session.AccessToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        /* 🌐 NETWORK ERROR (internet disconnected, CORS, server unreachable) */
        if (error.status === 0) {
          console.warn('Network error. Waiting for internet...');

          return fromEvent(window, 'online').pipe(
            take(1), // retry once when online
            switchMap(() => {
              console.log('Internet restored. Retrying request...');
              return next.handle(request);
            })
          );
        }

        /* 🔐 UNAUTHORIZED */
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }

        /* ❌ OTHER ERRORS */
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const session = this.storageService.getData('session');

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authSer.getAccessforRefreshToken(session).pipe(
        switchMap((res: any) => {
          session.AccessToken = res.access_token;
          this.storageService.saveData('session', session);

          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.access_token);

          return next.handle(this.addToken(request, res.access_token));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authSer.logout();
          return throwError(() => err);
        })
      );

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token =>
          next.handle(this.addToken(request, token))
        )
      );
    }
  }
}
