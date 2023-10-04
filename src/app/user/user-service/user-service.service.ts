import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth-service/auth.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backend: string = environment.backend || '';
  private BASE_PATH: string;
  private CONFIG: any;

  constructor(
    private http: HttpClient,
    public AuthService: AuthService
  ) {
    this.BASE_PATH = `${this.backend}/api/users`;
    this.CONFIG = this.AuthService.buildHeader();
  }

  async new(params: any) {
    const request: any = await this.http.post(`${this.BASE_PATH}/new`, params, this.CONFIG).toPromise();
    return request.data;
  }

  async find(search: any) {
    const request: any = await this.http.get(`${this.BASE_PATH}/find`, { params: search, headers: this.CONFIG.headers }).toPromise();
    return request.data;
  }

  async count(search: any) {
    const request: any = await this.http.get(`${this.BASE_PATH}/count`, { params: search, headers: this.CONFIG.headers }).toPromise();
    return request.data;
  }

  async findById(id: any) {
    const request: any = await this.http.get(`${this.BASE_PATH}/${id}`, this.CONFIG).toPromise();
    return request.data;
  }

  async all() {
    return this.find({});
  }

  async update(id: any, params: any) {
    const request: any = await this.http.put(`${this.BASE_PATH}/${id}/edit`, params, this.CONFIG).toPromise();
    return request.data;
  }

  async delete(id: any) {
    const request: any = await this.http.delete(`${this.BASE_PATH}/${id}`, this.CONFIG).toPromise();
    return request.data;
  }

  async updatePassword(id: any, params: any) {
    const request: any = await this.http.post(`${this.BASE_PATH}/${id}/update/password`, params, this.CONFIG).toPromise();
    return request.data;
  }

  async checkAccess() {
    // const request: any = await this.http.get(`${this.BASE_PATH}/check/access`, { headers: this.CONFIG.headers }).toPromise();
    // return request.data;
    return true;
  }

  async getAccessForUser(userId: any) {
    const request: any = await this.http.get(`${this.BASE_PATH}/${userId}/get/access`, { headers: this.CONFIG.headers }).toPromise();
    return request.data;
  }

  async deleteAccess(accessId: any) {
    const request: any = await this.http.delete(`${this.BASE_PATH}/${accessId}/delete/access`, { headers: this.CONFIG.headers }).toPromise();
    return request.data;
  }

  async addAccess(id: any, params: any) {
    const request: any = await this.http.post(`${this.BASE_PATH}/${id}/add/access`, params, this.CONFIG).toPromise();
    return request.data;
  }

}