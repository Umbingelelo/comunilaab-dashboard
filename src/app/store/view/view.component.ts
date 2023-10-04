import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../store-service/store-service.service';
import { Store } from '../store.types';
import { CategoryService } from '../categories-service/category-service.service';
import { PlaceService } from '../place-service/place-service.service';
import { faClose, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { LocationService } from '../location-service/location-service.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  public faClose = faClose;
  public faSpinner = faSpinner;
  public currentStore: Store | undefined;
  public currentPlace: any | undefined;
  public currentLocation: any | undefined;
  public allCategories: any[] = [];
  public circlePosition = {};
  public showCircle = false;
  public loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public StoreService: StoreService,
    public CategoryService: CategoryService,
    public PlaceService: PlaceService,
    public LocationService: LocationService,
    public Router: Router
  ) { }

  ngOnInit(): void {
    const { id } = this.activatedRoute.snapshot.params
    if (!id) return
    this.getStoreAndPlace(id).then(() => {
      this.getAllCategories(id);
      this.loading = false;
    }).catch((error) => {
      console.log(error)
    })
  }

  parseTime(time: string | undefined) {
    if (!time) return []
    return time.split(';');
  }

  getAllCategories(id: number) {
    this.CategoryService.find({ store_id: id }).then((categories: any) => {
      this.allCategories = categories
    }).catch((error) => {
      console.log(error)
    })
  }

  async getStoreAndPlace(storeId: number) {
    this.currentStore = await this.StoreService.findById(storeId);
    if (!this.currentStore) throw new Error('Store was not found');
    this.currentPlace = await this.PlaceService.findById(this.currentStore.place_id);
  }

  async plot() {
    if (!this.currentStore?.location_id) return
    this.currentLocation = await this.LocationService.findById(this.currentStore?.location_id);
    const map = document.getElementById('mapToSelect') as HTMLImageElement;
    const naturalHeight = map.naturalHeight;
    const naturalWidth = map.naturalWidth;
    const sizedHeight = map.height;
    const sizedWidth = map.width;
    this.circlePosition = {
      'left': this.currentLocation.xAxis * sizedWidth / naturalWidth + 'px',
      'top': this.currentLocation.yAxis * sizedHeight / naturalHeight + 'px'
    };
    this.showCircle = true;
  }

}
