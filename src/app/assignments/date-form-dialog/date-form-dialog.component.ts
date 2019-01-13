import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-date-form-dialog',
  templateUrl: './date-form-dialog.component.html',
  styleUrls: ['./date-form-dialog.component.scss']
})
export class DateFormDialogComponent implements OnInit {
  @ViewChild('f') form: NgForm;
  @ViewChild('datePicker') datePicker: any;

  formInitTimeoutId: any;
  formInitInterval = 400; // Delay for this.form.setValue() after form init
  unlockTimeoutId: any;
  unlockInterval = 200; // Delay for this.noteService.api('unlock', this.item) after closing NoteFormDialogComponent

  title = 'Calendar';
  instruction = 'View a specific day’s Assignments using one or more of the fields below.';
  subtitle1 = '';
  subtitle2 = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DateFormDialogComponent>
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    // If this.timeoutId id present, clear the previously invoked setTimeout()
    if (this.formInitTimeoutId !== null) {
      clearTimeout(this.formInitTimeoutId);
    }
    this.formInitTimeoutId = setTimeout(() => {
      this.setFormValue(this.data);
      this.datePicker.opened = true;
    }, this.formInitInterval);
  }

  setFormValue(data: any) {
    this.form.setValue({
      date: data.date
    });
  }

  onCloseForm() {
    this.dialogRef.close();
  }

  onSave() {
    const newDate = this.form.value['date'];
    this.dialogRef.close({ date: newDate });
  }

}
