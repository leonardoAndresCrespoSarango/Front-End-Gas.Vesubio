import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/authentication';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ToastrService} from "ngx-toastr";
import {FirebaseCodeErrorService} from "../../../../service/firebase-code-error.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isSubmitting = false;
  loginUsuario: FormGroup;
  formLogin: FormGroup;
  loading = false;
  loginForm = this.fb.nonNullable.group({
    username: ['ng-matero', [Validators.required]],
    password: ['ng-matero', [Validators.required]],
    rememberMe: [false],
  });

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService,private afAuth: AngularFireAuth,
              private toastr: ToastrService,
              private firebaseError: FirebaseCodeErrorService) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
    this.loginUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }


  entrar() {
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;

    this.loading = true;
    this.afAuth.signInWithEmailAndPassword(email, password).then((user) => {

      if(user.user?.emailVerified) {
        this.isSubmitting = true;

        this.auth
          .login(this.username.value, this.password.value, this.rememberMe.value)
          .pipe(filter(authenticated => authenticated))
          .subscribe(
            () => this.router.navigateByUrl('/'),
            (errorRes: HttpErrorResponse) => {
              if (errorRes.status === 422) {
                const form = this.loginUsuario;
                const errors = errorRes.error.errors;
                Object.keys(errors).forEach(key => {
                  form.get(key === 'email' ? 'username' : key)?.setErrors({
                    remote: errors[key][0],
                  });
                });
              }
              this.isSubmitting = false;
            }
          );
        console.log('entrando a dashboard')
      } else {
        this.router.navigate(['/verificar-correo']);
      }

    }).catch((error) => {
      this.loading = false;
      this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
    })
  }









  login() {
    this.isSubmitting = true;

    this.auth
      .login(this.username.value, this.password.value, this.rememberMe.value)
      .pipe(filter(authenticated => authenticated))
      .subscribe(
        () => this.router.navigateByUrl('/'),
        (errorRes: HttpErrorResponse) => {
          if (errorRes.status === 422) {
            const form = this.loginForm;
            const errors = errorRes.error.errors;
            Object.keys(errors).forEach(key => {
              form.get(key === 'email' ? 'username' : key)?.setErrors({
                remote: errors[key][0],
              });
            });
          }
          this.isSubmitting = false;
        }
      );
  }
}
