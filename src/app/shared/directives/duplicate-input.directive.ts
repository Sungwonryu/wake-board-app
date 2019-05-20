import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms'

export function duplicateInputValidator(list: any[], prop: string, val: string, limit: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let isDuplicate = false;

    if (control.value === val) {
      const duplicateList = list.filter((item: any) => {
        if (item && typeof item === 'object') {
          return (item.deleteUserId == null && item[prop] === val);
        }
      });
      if ((duplicateList.length + 1) > limit) {
        isDuplicate = true;
      }
    }

    return !isDuplicate ? null : { 'duplicateInput': { value: control.value } };
  }
}

@Directive({
  selector: '[appDuplicateInput][ngModel]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: DuplicateInputValidatorDirective,
    multi: true
  }]
})
export class DuplicateInputValidatorDirective implements Validator {
  @Input('duplicateList') list: any[];
  @Input('duplicateProp') prop: string;
  @Input('duplicateVal') val: string;
  @Input('duplicateLimit') limit: number;

  validate(control: AbstractControl): { [key: string]: any } | null {

    console.log('%%%% DuplicateInputValidator - list: ', this.list);

    const result = (this.list && typeof this.list === 'object' && this.list.constructor === Array && typeof this.prop === 'string' && this.prop.length && typeof this.val === 'string' && this.val.length && typeof this.limit === 'number' && this.limit >= 1) ?
      duplicateInputValidator(this.list, this.prop, this.val, this.limit)(control) :
      null;

    return result;
  }
}
