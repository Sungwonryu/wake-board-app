import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-confirmation-dialog',
  templateUrl: './edit-confirmation-dialog.component.html',
  styleUrls: ['./edit-confirmation-dialog.component.scss']
})
export class EditConfirmationDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

}
