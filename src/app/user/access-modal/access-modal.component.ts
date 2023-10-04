import { Component, Input, OnInit } from '@angular/core';
import { faTrash, faUniversalAccess } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';
import { User } from '../user.types';
import { UserService } from '../user-service/user-service.service';
import { Column } from 'src/app/shared/master-table/master-table.types';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Access, SelectOptions } from './access.type';
import { PlaceService } from '../../store/place-service/place-service.service';
@Component({
  selector: 'app-access-modal',
  templateUrl: './access-modal.component.html',
  styleUrls: ['./access-modal.component.css']
})
export class AccessModalComponent implements OnInit {

  @Input() user: User | Record<string, string> = {};

  public faTrash = faTrash;
  public faUniversalAccess = faUniversalAccess;

  public modal: ModalInterface | undefined;
  public modalId = 'changePasswordModal';

  public userAccess: Access[] = [];
  public dataToShow: Access[] = [];

  public columns: Column[] = [
    {
      title: "Rol",
      key: "role"
    },
    {
      title: "Filtro",
      key: "filter"
    },
    {
      title: "Acciones",
    }
  ]

  public roleForm: FormGroup | undefined;
  public filterForm: FormGroup | undefined;
  public SelectOptions: SelectOptions[] = [];

  public rolesAndFilters: Record<string, SelectOptions[]> = {
    'admin': [],
    'basic': [],
    'placeAdmin': []
  }

  public allRoles: SelectOptions[] = [
    { value: 'admin', viewValue: 'Administrador' },
    { value: 'basic', viewValue: 'Básico' },
    { value: 'placeAdmin', viewValue: 'Administrador de lugar' }
  ];

  public accessLoaded = false;

  constructor(
    public userService: UserService,
    public fb: FormBuilder,
    public PlaceService: PlaceService
  ) { }

  ngOnInit(): void {
    this.modalId = 'accessModal-' + this.user.id;
    this.initForm();
    setTimeout(() => {
      this.configModal();
      this.getAndSetAllData().then(() => {
        this.accessLoaded = true;
      }).catch((error) => {
        console.error(error)
      });
    }, 1)
  }

  async getAndSetAllData() {
    await this.fillRolesAndFilters();
    await this.getAccessByUser();
  }

  async fillRolesAndFilters() {
    const places = await this.PlaceService.all();
    this.rolesAndFilters['placeAdmin'] = places.map((place: any) => {
      return { value: place.id.toString(), viewValue: place.name };
    });
  }

  async getAccessByUser() {
    const access: Access[] = await this.userService.getAccessForUser(this.user.id)
    this.userAccess = access.map((access: Access) => {
      return this.translateTable(access);
    });
  }

  translateTable(userAccess: Access): Access {
    const role = this.allRoles.find((role: SelectOptions) => {
      return role.value === userAccess.role;
    });
    const filter = this.rolesAndFilters[userAccess.role].find((filter: SelectOptions) => {
      return filter.value === userAccess.filter;
    });
    return {
      id: userAccess.id,
      role: role ? role.viewValue : '',
      filter: filter ? filter.viewValue : ''
    };
  }

  initForm() {
    this.roleForm = this.fb.group({ role: [''] });
    this.filterForm = this.fb.group({ filter: [''] });
    if (this.roleForm && this.roleForm.get('role') && this.roleForm.get('role')?.valueChanges) {
      this.roleForm.get('role')?.valueChanges.subscribe(val => {
        if (val === 'placeAdmin') {
          this.SelectOptions = this.rolesAndFilters[val];
        } else {
          this.SelectOptions = [];
        }
      });
    }
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

  updateAccessTable(event: Access[]) {
    this.dataToShow = event;
  }

  deleteAccess(accessId: number) {
    this.userService.deleteAccess(accessId).then(() => {
      const temp = this.userAccess.filter((access: Access) => {
        return access.id !== accessId;
      });
      this.userAccess = [...temp];
    }).catch((error) => {
      console.error(error)
    })
  }

  addAccess() {
    const filterValue = this.filterForm?.get('filter')?.value;
    const roleValue = this.roleForm?.get('role')?.value;
    this.userService.addAccess(this.user.id, { filter: filterValue, role: roleValue }).then((access: Access) => {
      const translatedAccess = this.translateTable(access);
      this.userAccess = [...this.userAccess, translatedAccess];
    }).catch((error) => {
      console.error(error)
    })
  }

}