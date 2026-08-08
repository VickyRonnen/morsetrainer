import {InjectionToken} from '@angular/core';

const defaultErrors: {
  [key: string]: any;
} = {
  min: (controlErrors: any) => `Minimum value allowed ${controlErrors.min.min}`,
  max: (controlErrors: any) => `Maximum value allowed ${controlErrors.max.max}`,
  minlength: (controlErrors: any) => `Must be at least ${controlErrors.minlength.requiredLength} characters long.`,
};
export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors,
});
