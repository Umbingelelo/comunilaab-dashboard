import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { User } from 'src/app/user/user.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  async login(user: User): Promise<string> {
    const url = environment.backend + '/api/login';
    // const result: any = await this.http.post(url, user).toPromise();
    const token = 'test';
    this.setToken(token);
    return token;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['auth', 'login'], { queryParams: { msg: 'logout' } });
  }

  setToken(token: string) {
    localStorage.setItem('MORTY_TOKEN', token);
  }

  getToken() {
    return localStorage.getItem('MORTY_TOKEN');
  }

  clearAllStorage() {
    localStorage.clear();
  }

  buildHeader() {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return { headers };
  }

}
