import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user-service/user-service.service';
import { User } from '../user.types';
import { Dismiss } from 'flowbite';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public faSpinner = faSpinner;

  public emailThatGetError = '';

  public allRecords: User[] = [];

  public dataToShow: User[] = [];

  public columns = [
    {
      "title": "ID",
      "dataIndex": "id",
      "key": "id"
    }, {
      "title": "Email",
      "dataIndex": "email",
      "key": "email"
    }, {
      "title": "Estado",
      "dataIndex": "is_active",
      "key": "is_active"
    }, {
      "title": "Fecha de creación",
      "dataIndex": "created_at",
      "key": "created_at"
    },
    {
      "title": "Accesos"
    },
    {
      "title": "Acciones",
    }
  ]

  public loading = true;

  constructor(
    private UserService: UserService,
  ) { }

  ngOnInit(): void {
    this.UserService.all().then((allRecords: User[]) => {
      this.allRecords = allRecords;
    }).catch((error) => {
      console.error(error)
    }).finally(() => {
      this.loading = false;
    })
  }

  updateRecordsToShow(filteredRecords: User[]) {
    this.dataToShow = filteredRecords;
  }

  updateUser(event: User) {
    delete event['password'];
    this.UserService.update(event.id, event).then((response) => {
      this.allRecords = this.allRecords.map((record: User) => {
        if (record.id === response.id) {
          record = response;
        }
        return record;
      })
    }).catch((error) => {
      console.error(error)
    })
  }

  createUser(event: User) {
    this.UserService.new(event).then((response) => {
      this.allRecords.push(response)
      this.allRecords = [...this.allRecords];
    }).catch((error) => {
      this.emailThatGetError = event.email;
      this.showAlert();
      console.error(error)
    })
  }

  deleteUser(event: User | Record<string, string>) {
    this.UserService.delete(event.id).then((response) => {
      this.allRecords = this.allRecords.filter((record: User) => {
        return record.id !== response.id;
      })
    }).catch((error) => {
      console.error(error)
    })
  }

  localeDateWithHour(date: string) {
    return new Date(date).toLocaleString();
  }

  showAlert() {
    setTimeout(() => {
      const $alert = document.getElementById('alertMsg');
      if (!$alert) return;
      const alertObject = new Dismiss($alert, null, { timing: 'ease-out' });
      if ($alert && this.emailThatGetError !== '') {
        setTimeout(() => {
          alertObject.hide();
          setTimeout(() => {
            this.emailThatGetError = '';
          }, 100);
        }, 2000);
      } else {
        alertObject.hide();
      }
    }, 10);
  }

}
