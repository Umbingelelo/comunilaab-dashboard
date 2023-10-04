import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements AfterViewInit {

  constructor(
    public AuthService: AuthService
  ) { }

  ngAfterViewInit(): void {
    localStorage.clear();
    window.location.href = '/auth/login?msg=logout'
  }

}
