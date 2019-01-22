import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { ApiResponse } from '../../api-storage/api-storage.model';

@Injectable()
export class UIService {

  snackbarDuration = 2000; // 2 secs
  shortSnackbarDuration = 800; // 800 millisecs
  actionsShowSuccessMessage = ['insert', 'update', 'delete', 'duplicate'];
  $loadingStateChange = new Subject<boolean>();

  messageSucess = 'Success!';
  messageFail = 'Fail!';
  panelClass = ['snackbar-panel'];
  panelClassSuccess = ['snackbar-panel-success'];
  panelClassFail = ['snackbar-panel-fail'];

  constructor(
     private snackbar: MatSnackBar
  ) { }

  showProgressbar() {
    this.$loadingStateChange.next(true);
  }

  hideProgressbar() {
    this.$loadingStateChange.next(false);
  }

  showSnackbar({ message, duration, action = null, panelClass = [] }: {
    message: string,
    duration?: number,
    action?: string,
    panelClass?: string[]
  }) {
    const config = new MatSnackBarConfig();

    // If panelClass is not valid, set config.panelClass as this.panelClass
    if (panelClass && typeof panelClass === 'object' && panelClass.constructor === Array) {
      config.panelClass = panelClass[0]
    } else {
      config.panelClass = this.panelClass;
    }
    // If duration is not valid, set config.duration as this.snackbarDuration
    if (duration || typeof duration !== 'number' || !Number.isInteger(duration)) {
      config.duration = this.snackbarDuration;
    } else {
      config.duration = duration;
    }
    this.snackbar.open(message, action, config);
  }

  showAuthSnackbar({ message, success = true }: { message: string, success: boolean }) {
    let panelClass;
    let duration;
    if (success) {
      panelClass = this.panelClassSuccess;
      duration = this.shortSnackbarDuration;
    } else {
      panelClass = this.panelClassFail;
      duration = this.snackbarDuration;
    }
    this.showSnackbar({
      message: message,
      panelClass: panelClass,
      duration: duration
    });
  }

  showApiResponseMessage({ apiOpts, success }: ApiResponse) {
    let message: string;
    let duration: number = this.snackbarDuration;
    let panelClass: string[] = this.panelClass;

    if (success) {
      // When ApiResponse is successful
      if (this.actionsShowSuccessMessage.indexOf(apiOpts.baseParamsObj.action) !== -1) {
        // apiOpts.baseParamsObj.action is found in this.actionsShowSuccessMessage
        message = this.messageSucess;
        panelClass = this.panelClassSuccess;
        duration = this.shortSnackbarDuration;
      }
    } else {
      // When ApiResponse is not successful
      message = this.messageFail;
      panelClass = this.panelClassFail;
    }

    if (message) {
      // When message is set
      this.showSnackbar({
        message: message,
        panelClass: panelClass,
        duration: duration
      });
    }
  }
}
