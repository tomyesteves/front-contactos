import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationsService } from '../../validations/validations-service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  error = "";

  public myForm: FormGroup = this.formBuilder.group({
    email: ["", [Validators.required, Validators.pattern(this.validationsService.emailPattern)], [this.validationsService.checkIfEmailIsInUse]/*, [validadores asincronos, consultan al back]*/],
    password: ["", [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService
  ) { }

  isInvalidField(field: string) {
    return this.validationsService.isInvalidField(this.myForm, field);
  }

  submitForm(): void {
    if (this.myForm.valid) {
    } else {
      Object.keys(this.myForm.controls).forEach(field => {
        const control = this.myForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.error = "Datos incorrectos. Intente nuevamente"
    }
  }
}
