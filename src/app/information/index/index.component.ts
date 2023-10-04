import { Component, OnInit } from '@angular/core';
import { Column } from 'src/app/shared/master-table/master-table.types';
import { InformationService } from '../information-service/information-service.service';
import { differentTypes } from '../types';
import { StoreService } from '../../store/store-service/store-service.service';
import { PlaceService } from '../../store/place-service/place-service.service';
import { Modal, ModalOptions } from 'flowbite';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  readonly differentTypes = differentTypes;

  public loading = true;
  public faSpinner = faSpinner;

  public allStoresById: any = {};
  public allPlacesById: any = {};

  public recordsToShow: any[] = [];
  public allInformationRecords: any[] = [];

  public columns: Column[] = [
    {
      key: 'title',
      title: 'Titulo',
    }, {
      title: 'Lugar',
    }, {
      title: 'Tienda',
    }, {
      key: 'type',
      title: 'Tipo',
    }, {
      key: 'is_active',
      title: 'Activo',
    }
  ];

  public allPlaces: any[] = [];
  public placesToShow: any[] = [];


  constructor(
    public InformationService: InformationService,
    public StoreService: StoreService,
    public PlaceService: PlaceService,
    public Router: Router
  ) { }

  ngOnInit(): void {
    this.getAllData().catch((error) => {
      console.log(error);
    }).finally(() => {
      this.loading = false;
    })
  }

  async getAllData() {
    const currentPlaceId = localStorage.getItem('CURRENT_PLACE');
    if (!currentPlaceId) {
      this.Router.navigate(['/place']);
    } else {
      await this.getAllStores();
      await this.getAllPlaces();
      await this.getAndFormatAllRecords();
    }
  }

  async getAllPlaces() {
    this.allPlaces = await this.PlaceService.find({
      id: localStorage.getItem('CURRENT_PLACE')
    });
    this.allPlacesById = this.allPlaces.reduce((prev: any, current: any) => {
      prev[current.id] = current;
      return prev;
    }, {});
  }

  async getAllStores() {
    const allStores = await this.StoreService.find({
      place_id: localStorage.getItem('CURRENT_PLACE')
    });
    this.allStoresById = allStores.reduce((prev: any, current: any) => {
      prev[current.id] = current;
      return prev;
    }, {});
  }

  async getAndFormatAllRecords() {
    const allInformationRecords = await this.InformationService.find({
      place_id: localStorage.getItem('CURRENT_PLACE')
    });
    this.allInformationRecords = allInformationRecords.map((record: any) => {
      return {
        ...record,
        place_name: this.allPlacesById[record.place_id]?.name,
        store_name: this.allStoresById[record.store_id]?.name,
      }
    })
  }

  updateInformationRecords(newArray: any) {
    this.recordsToShow = newArray;
  }

  redirectToCreate() {
    const placeId = localStorage.getItem('CURRENT_PLACE')
    this.Router.navigate([`/information/form/${placeId}`]);
  }

}
