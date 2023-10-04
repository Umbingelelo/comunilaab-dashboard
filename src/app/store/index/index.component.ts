import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store-service/store-service.service';
import { Column } from 'src/app/shared/master-table/master-table.types';
import { Store } from '../store.types';
import { Router } from '@angular/router';
import { faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PlaceService } from '../place-service/place-service.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public faTrash = faTrash;
  public faSpinner = faSpinner;
  public loading = true;

  public allShops: Store[] = [];
  public dataToShow: Store[] = [];
  public columns: Column[] = [
    { title: 'Logo' },
    { title: 'Nombre' },
    { title: 'Lugar' },
    { title: 'Estado' },
  ]

  constructor(
    public StoreService: StoreService,
    public router: Router,
    public PlaceService: PlaceService
  ) { }

  ngOnInit(): void {
    this.getAllData().catch((error) => {
      console.log(error);
    })
  }

  async getAllData() {
    const currentPlaceId = localStorage.getItem('CURRENT_PLACE');
    if (!currentPlaceId) return this.router.navigate(['/place']);
    const place = await this.PlaceService.findById(currentPlaceId);
    const tempAllStores = await this.StoreService.find({ place_id: currentPlaceId });
    this.allShops = tempAllStores.map((shop: any) => {
      return {
        ...shop,
        place_name: place.name
      }
    });
    this.loading = false;
    return
  }

  updateRowsInTable(array: Store[]) {
    this.dataToShow = array;
  }

  redirectToStore(storeId: number) {
    this.router.navigate([`/store/${storeId}`]);
  }

  redirectToCreate() {
    const placeId = localStorage.getItem('CURRENT_PLACE')
    return this.router.navigate(['store', 'form', placeId]);
  }

} 
