import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';
import { User } from '../user.types';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  @Input() user: User | Record<string, string> = {};
  @Input() type: 'create' | 'edit' = 'create';
  @Output() modifiedUser: EventEmitter<User> = new EventEmitter();

  public faEdit = faEdit;

  public modal: ModalInterface | undefined;
  public modalId = 'createUserModal';

  ngOnInit(): void {
    if (this.user) this.modalId = 'editUserModal-' + this.user.id;
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

  createUser(user: User) {
    this.modifiedUser.emit(user);
    this.closeModal();
  }

}
