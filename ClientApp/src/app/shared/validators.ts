import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validateServiceEndDate(control: AbstractControl): ValidationErrors {
  let startDateValue = control.get('serviceStartDate').value;
  let endDateValue = control.get('serviceEndDate').value;

  if (endDateValue < startDateValue && endDateValue !== null) {
    return { 'validateServiceEndDate': 'validateServiceEndDate' }
  } return null;
}

export function validateEndDate(control: AbstractControl): ValidationErrors {
  let startDateValue = control.get('startDate').value;
  let endDateValue = control.get('endDate').value;

  if (endDateValue < startDateValue && endDateValue !== null) {
    return { 'validateEndDate': 'validateEndDate' }
  } return null;
}
