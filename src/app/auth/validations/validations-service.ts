import { Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor(private authService: AuthService) { }

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  isInvalidField(formGroup: FormGroup, field: string): boolean {
    return formGroup.controls[field].touched && formGroup.controls[field].invalid
  }

  checkIfEmailIsInUse = (control: FormControl): Observable<ValidationErrors | null> => {
    let emailInUse;
    this.authService.isEmailValid(control.value).subscribe(res => {
      emailInUse = res;
    });
    return of(emailInUse ? { emailExists: true } : null).pipe(delay(3000));
  };

  validateEmail(formControl: FormControl): ValidationErrors | null {
    const value: string = formControl.value.trim().toLowerCase();

    if (value.endsWith("yahoo.com")) {
      return {
        isMailValid: false
      }
    }
    return null;
  }
}
