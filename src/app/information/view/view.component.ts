import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InformationService } from '../information-service/information-service.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { differentTypes } from '../types';
import { PlaceService } from '../../store/place-service/place-service.service';
import { StoreService } from '../../store/store-service/store-service.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  public faSpinner = faSpinner;

  readonly differentTypes = differentTypes;

  public currentInformation: any = {};
  public currentPlace: any = {};
  public currentStore: any = {};

  public loading = true;

  constructor(
    public activatedRoute: ActivatedRoute,
    public InformationService: InformationService,
    public PlaceService: PlaceService,
    public StoreService: StoreService
  ) { }

  ngOnInit(): void {
    const { id } = this.activatedRoute.snapshot.params;
    this.getAllData(id).catch((error) => {
      console.error(error)
    }).finally(() => {
      this.loading = false;
    })
  }

  async getAllData(id: any) {
    this.currentInformation = await this.InformationService.findById(id);
    if (this.currentInformation.place_id) {
      this.currentPlace = await this.PlaceService.findById(this.currentInformation.place_id);
    }
    if (this.currentInformation.store_id) {
      this.currentStore = await this.StoreService.findById(this.currentInformation.store_id);
    }
  }

}
