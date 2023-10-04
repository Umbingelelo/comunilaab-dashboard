import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';
import { UserService } from '../user-service/user-service.service';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { User } from '../user.types';

function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent implements OnInit {

  @Input() user: User | Record<string, string> = {};

  public faLock = faLockOpen;

  public modal: ModalInterface | undefined;
  public modalId = 'changePasswordModal';

  public passwordForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: passwordMatchValidator });

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.modalId = 'changePasswordModal-' + this.user.id;
    setTimeout(() => {
      this.configModal()
    }, 500)
  }

  configModal() {
    const $modalElement: HTMLElement = document.querySelector('#' + this.modalId) as HTMLElement;

    const modalOptions: ModalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900 bg-opacity-50 fixed inset-0 z-40',
      closable: true,
    }

    this.modal = new Modal($modalElement, modalOptions);
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.hide()
    this.passwordForm.reset();
  }

  openModal() {
    if (!this.modal) return;
    this.modal.show()
    this.passwordForm.reset();
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const password = this.passwordForm.value.password;
      this.userService.updatePassword(this.user.id, { password }).catch((error) => {
        console.log(error)
      }).finally(() => {
        this.closeModal();
      })
    }
  }

  checkError(controlName: string, errorName: string) {
    if (!this.passwordForm.touched) return false;
    return this.passwordForm.controls[controlName].hasError(errorName);
  }

  checkIfPasswordsMatch() {
    if (!this.passwordForm.touched) return false;
    return this.passwordForm.hasError('passwordMismatch');
  }

}
