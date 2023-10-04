import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private backend: string = environment.backend || '';
  private BASE_PATH: string;
  private config: any;
  constructor(
    private http: HttpClient, private AuthService: AuthService
  ) {
    this.BASE_PATH = `${this.backend}`;
    this.config = this.AuthService.buildHeader();
  }

  async getInteractionsPerDay(placeId: number, search: any) {
    const headers = this.config.headers;
    const request: any = await this.http.get(`${this.BASE_PATH}/api/interaction/unique/${placeId}`, { params: search, headers }).toPromise();
    return request.data;
  }

  async getInteractionsType(search: any) {
    const headers = this.config.headers;
    const request: any = await this.http.get(`${this.BASE_PATH}/api/interaction/get/type`, { params: search, headers }).toPromise();
    return request.data;
  }

  async getInteractionsStore(search: any) {
    const headers = this.config.headers;
    const request: any = await this.http.get(`${this.BASE_PATH}/api/interaction/get/store`, { params: search, headers }).toPromise();
    return request.data;
  }

  async getInteractionsInfo(search: any) {
    const headers = this.config.headers;
    const request: any = await this.http.get(`${this.BASE_PATH}/api/interaction/get/info`, { params: search, headers }).toPromise();
    return request.data;
  }

  async getInteractionsCategory(search: any) {
    const headers = this.config.headers;
    const request: any = await this.http.get(`${this.BASE_PATH}/api/interaction/get/category`, { params: search, headers }).toPromise();
    return request.data;
  }

  async getInteractionsTimeRange(placeId: number, search: any) {
    const headers = this.config.headers;
    const request: any = await this.http.get(`${this.BASE_PATH}/api/interaction/time/${placeId}`, { params: search, headers }).toPromise();
    return request.data;
  }

  async getInteractions(search: any) {
    const headers = this.config.headers;
    const request: any = await this.http.get(`${this.BASE_PATH}/api/interaction/find`, { params: search, headers }).toPromise();
    return request.data;
  }

  async getInteractionsSessions(search: any) {
    const headers = this.config.headers;
    const request: any = await this.http.get(`${this.BASE_PATH}/api/interaction/get/session`, { params: search, headers }).toPromise();
    return request.data;
  }

  async getInteractionsUseTime(placeId: number, search: any) {
    const headers = this.config.headers;
    const request: any = await this.http.get(`${this.BASE_PATH}/api/interaction/use/${placeId}`, { params: search, headers }).toPromise();
    return request.data;
  }

  async getSuccessfulQuestions(placeId: number, search: any) {
    const headers = this.config.headers;
    const request: any = await this.http.get(`${this.BASE_PATH}/api/interaction/successful/${placeId}`, { params: search, headers }).toPromise();
    return request.data;
  }
}
