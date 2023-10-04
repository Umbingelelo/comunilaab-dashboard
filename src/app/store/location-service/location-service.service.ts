import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth-service/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {


  private backend: string = environment.backend || '';
  private BASE_PATH: string;
  private CONFIG: any;

  constructor(
    private http: HttpClient,
    public AuthService: AuthService
  ) {
    this.BASE_PATH = `${this.backend}/api/location`;
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

}
