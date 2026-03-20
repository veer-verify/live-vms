import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  config: MatSnackBarConfig;

  constructor(private snackbar: MatSnackBar, private zone: NgZone) {
    this.config = new MatSnackBarConfig();
    this.config.panelClass = ["snackbar-container"];
    this.config.verticalPosition = "bottom";
    this.config.horizontalPosition = "center";
    this.config.duration = 3000;
  }

  show(message: any, config?: MatSnackBarConfig) {
    config = config || this.config;
    this.zone.run(() => {
      this.snackbar.open(message, "x", config);
    });
  }

  error(message: any) {
    Swal.fire({
      icon: 'error',
      title: 'Failed!',
      text: message,
      showCloseButton: true
    })
  }

  warn(message: any) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning!',
      text: message,
      showCloseButton: true
    })
  }

  success(message: any) {
    Swal.fire({
      icon: 'success',
      title: `Done!`,
      text: `${message}`,
      showCloseButton: true,
      timer: 2000
    })
  }

  snackSuccess(message: any) {
    this.config.panelClass = ["success", "snackbar-container"];
    this.show(message);
  }

  snackError(message: any) {
    this.config.panelClass = ["error", "snackbar-container"];
    this.show(message);
  }

  confirm(alert:any) {
    return Swal.fire({
      title: "Are you sure?",
      text:alert,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    });
  }

   wait() {
    Swal.fire({
      text: "Please wait",
      imageUrl: "assets/gif/ajax-loading-gif.gif",
      showConfirmButton: false,
      allowOutsideClick: false
    })
  }
}
