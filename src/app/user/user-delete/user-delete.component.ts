import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'flowbite'
import type { ModalOptions, ModalInterface } from 'flowbite'
import { User } from '../user.types';
@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent implements OnInit {

  @Input() user: User | Record<string, string> = {};
  @Output() deleteUser: EventEmitter<User | Record<string, string>> = new EventEmitter();

  public faTrash = faTrash;

  public modal: ModalInterface | undefined;
  public modalId = 'deleteUserModal';

  ngOnInit(): void {
    this.modalId = 'deleteUserModal-' + this.user.id;
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
  }

  openModal() {
    if (!this.modal) return;
    this.modal.show()
  }

  delete() {
    this.deleteUser.emit(this.user);
    this.closeModal();
  }

}
