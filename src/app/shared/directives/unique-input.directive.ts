import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms'

// Input must be unique among prop perperties in list
// except when input is same as the property of the edited item
export function uniqueInputValidator(list: any[], prop: string, editedItem: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {

    let isUnique = true;
    for (let i = 0; i < list.length; i++) {
      if (list && Array.isArray(list)
          && typeof list[i][prop] === 'string'
          && typeof control.value === 'string') {
        if (list[i][prop].toLowerCase() === control.value.toLowerCase()) {
          // When any string list[i][prop] is same as control.value
          // control.value is not unique
          if (editedItem && typeof editedItem === 'object' && typeof editedItem[prop] === 'string'
              && editedItem[prop].toLowerCase() === control.value.toLowerCase()) {
            // When control.value is same as editedItem[prop]
            // isUnique is not false
            isUnique = true;
          } else {
            // When control.value is not same as editedItem[prop]
            // isUnique is false
            isUnique = false;
            break;
          }
        }
      }
    }
    return isUnique ? null : { 'uniqueInput': { value: control.value } };
  }
}

@Directive({
  selector: '[appUniqueInput][ngModel]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: UniqueInputValidatorDirective,
    multi: true
  }]
})
export class UniqueInputValidatorDirective implements Validator {
  @Input('appList') list: any[];
  @Input('appProperty') prop: string;
  @Input('appItem') item: any;

  validate(control: AbstractControl): { [key: string]: any } | null {

    const result = (this.list && this.prop) ?
      uniqueInputValidator(this.list, this.prop, this.item)(control) :
      null;

    console.log(`UniqueInputValidator - prop: ${this.prop}, result: `, result);
    return result;
  }

}
