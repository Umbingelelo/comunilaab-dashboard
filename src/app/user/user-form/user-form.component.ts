import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../user.types';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Input() user: User | Record<string, string> = {};
  @Input() type: 'create' | 'edit' = 'create';
  @Output() checkValidForm: EventEmitter<User> = new EventEmitter();

  public loading = true;
  public userForm: FormGroup | undefined;

  ngOnInit(): void {

    const passwordValidator = this.type === 'edit' ? [] : [Validators.required];

    const passwordMatchValidator = (formGroup: AbstractControl) => {
      const password = formGroup.get('password');
      const confirmPassword = formGroup.get('confirmPassword');
      if (password && confirmPassword && this.type === 'edit') {
        if (password.value === '' && confirmPassword.value === '') {
          return null;
        } else {
          return password.value === confirmPassword.value ? null : { passwordMismatch: true };
        }
      } else {
        return password && confirmPassword && password.value === confirmPassword.value ? null : { passwordMismatch: true };
      }
    };

    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', passwordValidator),
      confirmPassword: new FormControl('', passwordValidator),
      is_active: new FormControl(false),
    }, { validators: passwordMatchValidator });

    if (this.user) {
      this.user.password = '';
      this.user.confirmPassword = '';
      this.userForm.patchValue(this.user);
    }

    this.loading = false;
  }

  onSubmit() {
    if (this.user && this.userForm && this.userForm.valid && this.userForm.touched) {
      const user = this.userForm.value;
      if (this.type === 'edit') user.id = this.user.id;
      delete user.confirmPassword;
      this.checkValidForm.emit(user);
      this.userForm.patchValue({ password: '', confirmPassword: '' });
    }
  }

  checkError(key: string, error?: string) {
    if (!this.userForm) throw new Error('userForm is undefined');
    if (!this.userForm.touched) return false;
    if (!error) return this.userForm.controls[key];
    return this.userForm.controls[key].hasError(error);
  }

  checkIfPasswordsMatch(): boolean {
    if (!this.userForm) throw new Error('userForm is undefined');
    if (!this.userForm.touched) return false;
    return this.userForm.hasError('passwordMismatch');
  }

}
