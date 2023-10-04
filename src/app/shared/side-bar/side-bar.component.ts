import { AfterViewInit, Component, isDevMode } from '@angular/core';
import { NAV_DATA } from './nav-data'
import { SideBarElement } from './side-bar.types';
import { faCoffee, faSignOut, faHome } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Drawer, DrawerInterface, Modal, ModalInterface, ModalOptions } from 'flowbite';
import { UserService } from '../../user/user-service/user-service.service';
import { AuthService } from '../../auth/auth-service/auth.service';
import { Access } from 'src/app/user/access-modal/access.type';
import { PlaceService } from '../../store/place-service/place-service.service';
import { Column } from '../master-table/master-table.types';
import { SidebarTriggerService } from '../sidebar-trigger/sidebar-trigger.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements AfterViewInit {

  public faSpinner = faSpinner;

  public faSignOut = faSignOut;
  public faHome = faHome;

  readonly navBarElements = NAV_DATA;
  public navBarElementsFiltered: SideBarElement[][] = [];

  public allPlaces: any[] = [];
  public allPlacesToShow: any[] = [];
  public modal: ModalInterface | undefined;
  public columns: Column[] = [
    {
      title: 'Nombre'
    },
    {
      title: 'Acciones'
    }
  ]

  public drawer: DrawerInterface | undefined;
  public openMenus: Record<string, boolean> = {};
  public devDoc: SideBarElement = {
    type: 'link',
    routerLink: '/dev/devdoc',
    icon: faCoffee,
    label: 'Developer Document',
    accessRequired: [{
      role: '',
      filter: '',
    }],
  };

  constructor(
    public route: Router,
    public UserService: UserService,
    public AuthService: AuthService,
    public PlaceService: PlaceService,
    public sidebarService: SidebarTriggerService
  ) {
    this.sidebarService.trigger$.subscribe(() => {
      this.PlaceService.all().then((response) => {
        this.allPlaces = response;
        this.configModal();
      }).catch((error) => {
        console.error(error);
      });
    });
  }

  ngAfterViewInit(): void {
    if (isDevMode()) this.addDevDoc();
    const $drawerElement = document.getElementById('logo-sidebar');
    if (!$drawerElement) return console.error('No se encontró el elemento con id logo-sidebar');
    this.drawer = new Drawer($drawerElement, {});
    this.filterElements();

    this.PlaceService.all().then((response) => {
      this.allPlaces = response;
      this.configModal();
    }).catch((error) => {
      console.error(error);
    });
  }

  getCurrentPlace() {
    const currentPlaceId: any = localStorage.getItem('CURRENT_PLACE');
    return this.allPlaces.find((element) => element.id === parseInt(currentPlaceId))
  }

  toggleSidebar() {
    this.drawer?.toggle();
  }

  redirectToLogOut() {
    this.route.navigateByUrl('/auth/logout');
    this.drawer?.hide();
  }

  filterElements() {
    this.UserService.checkAccess().then((res) => {
      const isAdmin = true
      if (isAdmin) {
        this.navBarElementsFiltered = this.navBarElements;
        return;
      }
      // const filteredSideBar = this.navBarElements.map((element: SideBarElement[]) => {
      //   return element.filter((subElement: SideBarElement) => {
      //     return this.filterSubElement(subElement, res);
      //   });
      // });

      // this.navBarElementsFiltered = filteredSideBar.filter((element: SideBarElement[]) => {
      //   return element.length;
      // });
    }).catch((error) => {
      console.log(error)
    });
  }

  addDevDoc() {
    const devDocExists = this.navBarElements.some((element: SideBarElement[]) => {
      return element.some((subElement: SideBarElement) => {
        return subElement.routerLink === this.devDoc.routerLink;
      })
    })
    if (devDocExists) return;
    this.navBarElements.push([this.devDoc])
  }

  filterSubElement(subElement: SideBarElement, personalAccess: Access[]) {
    const { accessRequired } = subElement;
    if (!accessRequired.length) return true;
    return accessRequired.some((accessRequired: Access) => {
      if (!accessRequired.role) return true;
      // accessRequired.filter = accessRequired.filter.replace('$PLACE_ID$', '1');
      return personalAccess.some((access: Access) => {
        if (!accessRequired.filter) return accessRequired.role === access.role;
        return accessRequired.role === access.role && accessRequired.filter === access.filter;
      });
    })
  }

  configModal() {
    const $modalElement: HTMLElement = document.querySelector('#placeSelect') as HTMLElement;
    const modalOptions: ModalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900 bg-opacity-50 fixed inset-0 z-40',
      closable: true,
    }
    this.modal = new Modal($modalElement, modalOptions);
  }

  openModal() {
    if (!this.modal) return;
    this.modal.show();
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.hide();
  }

  updatePlacesToShow(event: any) {
    this.allPlacesToShow = event;
  }

  selectPlace(placeId: any) {
    localStorage.setItem('CURRENT_PLACE', placeId);
    this.modal?.hide();
    return this.route.navigate(['/redirect'], {
      queryParams: {
        route: '/dashboard'
      }
    })
  }

}
