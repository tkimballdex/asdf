import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validateEndDate(control: AbstractControl): ValidationErrors {
      let startDateValue = control.get('serviceStartDate').value;
      let endDateValue = control.get('serviceEndDate').value;
  
      if (endDateValue < startDateValue && endDateValue !== null) {
        return { 'validateEndDate': 'endBeforeDate' }
      } return null;
  }

  