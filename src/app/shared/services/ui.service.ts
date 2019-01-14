import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

import { ApiResponse } from '../../api-storage/api-storage.model';

@Injectable()
export class UIService {

  snackbarDuration = 2000; // 2 secs
  shortSnackbarDuration = 800; // 800 millisecs
  actionsShowSuccessMessage = ['insert', 'update', 'delete', 'duplicate'];
  $loadingStateChange = new Subject<boolean>();

  constructor(
     private snackbar: MatSnackBar
  ) { }

  showProgressbar() {
    this.$loadingStateChange.next(true);
  }

  hideProgressbar() {
    this.$loadingStateChange.next(false);
  }

  showSnackbar({ message, action, duration }: {
    message: string,
    action?: string,
    duration?: number
  }) {
    if (duration || typeof duration !== 'number' || !Number.isInteger(duration)) {
      // If duration is not valid, set duration as this.snackbarDuration
      duration = this.snackbarDuration;
    }
    this.snackbar.open(message, action, {
      duration: duration
    });
  }

  showApiResponseMessage({ apiOpts, success, error }: ApiResponse) {
    let message: string;
    let duration = this.snackbarDuration;

    if (success) {
      // When ApiResponse is successful
      if (this.actionsShowSuccessMessage.indexOf(apiOpts.baseParamsObj.action) !== -1) {
        // apiOpts.baseParamsObj.action is found in this.actionsShowSuccessMessage
        message = `"${apiOpts.baseParamsObj.object}" - ${apiOpts.baseParamsObj.action} operation was successful.`;
        duration = this.shortSnackbarDuration;
      }
    } else {
      // When ApiResponse is not successful
      if (error) {
        // When there was a network failure
        message = `Sorry, there was a http failure on "${apiOpts.baseParamsObj.object}" ${apiOpts.baseParamsObj.action} operation.
  Please try later.`;
      } else {
        // When there was no network error but API operation was not successful
        message = `Sorry, there was a problem on "${apiOpts.baseParamsObj.object}" ${apiOpts.baseParamsObj.action} operation.
  Please try later.`;
      }
    }

    if (message) {
      // When message is set
      this.showSnackbar({
        message: message,
        duration: duration
      });
    }
  }
}
