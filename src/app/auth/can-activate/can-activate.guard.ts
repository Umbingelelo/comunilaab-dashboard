import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private AuthService: AuthService
  ) { }

  canActivate(): boolean {
    const helper = new JwtHelperService();
    const token = this.AuthService.getToken();
    if (token && this.isValidJwtStructure(token) && !helper.isTokenExpired(token)) {
      return true;
    } else {
      this.router.navigate(['auth', 'login'], {
        queryParams: {
          msg: 'unauthorized'
        }
      });
      return false;
    }
  }

  public isValidJwtStructure(token: string): boolean {
    if (typeof token !== 'string' || (token.match(/\./g) || []).length !== 2) return false;
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return false;
    try {
      const decodedHeader = window.atob(header);
      const decodedPayload = window.atob(payload);
      JSON.parse(decodedHeader);
      JSON.parse(decodedPayload);
    } catch (e) {
      return false;
    }
    return true;
  }

}