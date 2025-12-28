import {ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormGroupDirective, ValidationErrors} from '@angular/forms';
import {BehaviorSubject, distinctUntilChanged, merge, Subscription} from 'rxjs';
import {FORM_ERRORS} from '../app.formerrors';

//Based on https://medium.com/@iamjustin/simplifying-form-error-validations-in-angular-f21adea5d028
@Component({
  selector: 'control-error',
  imports: [
    AsyncPipe
  ],
  templateUrl: './control-error.html',
  styleUrl: './control-error.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlError implements OnInit, OnDestroy {
  errors = inject(FORM_ERRORS);
  message$ = new BehaviorSubject<string>('');
  @Input() controlName!: string;
  @Input() customErrors?: ValidationErrors;
  private subscription = new Subscription();
  private readonly formGroupDirective = inject(FormGroupDirective);

  ngOnInit(): void {
    if (this.formGroupDirective) {
      const control = this.formGroupDirective.control.get(this.controlName);

      if (control) {
        this.subscription = merge(control.valueChanges, this.formGroupDirective.ngSubmit)
          .pipe(distinctUntilChanged())
          .subscribe(() => {
            const controlErrors = control.errors;

            if (controlErrors) {
              const firstKey = Object.keys(controlErrors)[0];
              const getError = this.errors[firstKey];
              const text = this.customErrors?.[firstKey] || getError;
              if (!text) {
                console.error(`Missing key '${firstKey}' in app.formerrors.ts`);
              }
              this.setError(text(controlErrors));
            } else {
              this.setError('');
            }
          });
      } else {
        const message = this.controlName
          ? `Control "${this.controlName}" not found in the form group.`
          : `Input controlName is required`;
        console.error(message);
      }
    } else {
      console.error(`ErrorComponent must be used within a FormGroupDirective.`);
    }
  }

  setError(text: string) {
    if (text.length === 0) {
      this.message$.next('');
    } else {
      this.message$.next(this.controlName + " is invalid: " + text);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
