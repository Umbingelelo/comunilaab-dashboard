import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../auth-service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Dismiss } from 'flowbite';
import { PlaceService } from '../../store/place-service/place-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loading = false;
  public loginError = false;
  public errorMsg: string | undefined;
  public submitted = false;
  public message: string | undefined;
  public messageColor: string | undefined;
  public showAlertMessage = false;

  public loginForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  public errorMessages: Record<string, string> = {
    "not_found": "Uh! No se encontró la cuenta",
    "wrong_credentials": "Ups! Revisa tus credenciales",
    "deactivated": "Tu usuario ha sido deshabilitado",
  }

  public alertMessagesByCode: Record<string, Record<string, string>> = {
    'logout': {
      text: 'Has cerrado sesión exitosamente',
      class: 'text-green-800 bg-green-50',
    },
    "unauthorized": {
      text: 'Inicia sesión nuevamente',
      class: 'text-teal-800 bg-teal-50',
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public HttpClient: HttpClient
  ) { }

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) this.redirectToDashboard();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['msg']) {
        this.showAlert(params);
      }
    })
  }

  onSubmit() {
    this.submitted = true;
    this.loginError = false;
    this.router.navigate(['home']);
    // if (!this.loginForm.valid) return;
    // this.validate();
  }

  validate() {
    this.loading = true;
    const { value } = this.loginForm;
    const { email, password } = value;
    // this.authService.login({ email, password }).then(() => {
    //   this.loading = false;
    //   this.redirectToDashboard();
    // }).catch((err: HttpErrorResponse) => {
    //   const errorCode = err.error.fullError?.chinchayCode || 500;
    //   this.errorMsg = this.errorMessages[errorCode] || 'Ha habido un error inesperado';
    //   this.loginError = true;
    //   this.loading = false;
    // });
  }

  redirectToDashboard() {
    const placeServiceInstance = new PlaceService(this.HttpClient, this.authService);
    placeServiceInstance.all().then((allPlaces) => {
      if (allPlaces.length > 0) {
        localStorage.setItem('CURRENT_PLACE', allPlaces[0].id)
        return this.router.navigate(['dashboard']);
      }
      return this.router.navigate(['place']);
    }).catch((error) => {
      console.error(error);
      return this.router.navigate(['auth', 'logout'])
    })
  }

  hasError(field: string, error: string) {
    const control = this.loginForm.get(field);
    return control?.dirty && control.hasError(error);
  }

  showAlert(params: Record<string, string>) {
    this.showAlertMessage = true;
    setTimeout(() => {
      const { msg } = params;
      const $alert = document.getElementById('msg');
      const alertObject = new Dismiss($alert, null, { timing: 'ease-out', });
      if (msg && this.alertMessagesByCode[msg]) {
        this.message = this.alertMessagesByCode[msg] ? this.alertMessagesByCode[msg]['text'] : '';
        this.messageColor = this.alertMessagesByCode[msg] ? this.alertMessagesByCode[msg]['class'] : '';
        setTimeout(() => {
          if (alertObject.hide) {
            alertObject.hide();
          }
        }, 5000);
      } else {
        alertObject.hide();
      }
    }, 10);
  }

}
