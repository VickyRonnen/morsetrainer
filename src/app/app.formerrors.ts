import {InjectionToken} from '@angular/core';

const defaultErrors: {
  [key: string]: any;
} = {
  required: () => 'This field is required',
  min: (controlErrors: any) => `Minimum value allowed ${controlErrors.min.min}`,
  max: (controlErrors: any) => `Maximum value allowed ${controlErrors.max.max}`,

  email: () => 'Invalid email address',
  minlength: (controlErrors: any) => `Must be at least ${controlErrors.minlength.requiredLength} characters long.`,
  matching: () => 'New and confirm passwords don\'t match',
  invalidDateFormat: () => 'Invalid date, format dd-mm-yyyy expected',
  invalidDate: () => 'Invalid date',
  FromAfterThru: () => 'From date after thru date',
};
export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors,
});
