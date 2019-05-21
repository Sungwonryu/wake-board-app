import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms'

// Input must be included in the property of list
// except when input is same as the property of the edited item
export function includeInputValidator(list: any[], type: string, prop1: string, prop2?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let isIncluded = false;

    if (control.value === '') {
      isIncluded = true;
    } else if (type.toLowerCase() === 'vessel' &&
        typeof control.value === 'string' &&
        typeof control.value.length) {
      for (let i = 0; i < list.length; i++) {
        const vesselNo = list[i]['vesselNo'] || '';
        const vesselName = list[i]['vesselName'] || '';
        let vesselText = '';
        if (vesselNo) {
          vesselText = vesselNo;
        }
        if (vesselName) {
          vesselText += ' - ' + vesselName;
        }
        if (vesselText === control.value) {
          isIncluded = true;
          break;
        }
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        if (list && Array.isArray(list)
        && typeof list[i][prop1] === 'string'
        && typeof control.value === 'string') {
          if (list[i][prop1].toLowerCase() === control.value.toLowerCase()) {
            isIncluded = true;
            break;
          }
        }
        if (list && Array.isArray(list)
        && typeof list[i][prop2] === 'string'
        && typeof control.value === 'string') {
          if (list[i][prop2].toLowerCase() === control.value.toLowerCase()) {
            isIncluded = true;
            break;
          }
        }
      }
    }

    return isIncluded ? null : { 'includeInput': { value: control.value } };
  }
}

@Directive({
  selector: '[appIncludeInput][ngModel]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: IncludeInputValidatorDirective,
    multi: true
  }]
})
export class IncludeInputValidatorDirective implements Validator {
  @Input('itemList') list: any[];
  @Input('itemProp1') prop1: string;
  @Input('itemProp2') prop2: string;
  @Input('itemType') type: string;

  validate(control: AbstractControl): { [key: string]: any } | null {

    const result = (this.list && this.prop1) ?
      includeInputValidator(this.list, this.type, this.prop1, this.prop2)(control) :
      null;

    // console.log(`IncludeInputValidator - prop1: ${this.prop1}, prop2: ${this.prop2}, result: `, result);
    return result;
  }

}
