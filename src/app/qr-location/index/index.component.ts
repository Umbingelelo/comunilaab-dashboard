import { Component, OnInit } from '@angular/core';
import { faEdit, faMap, faScrewdriver, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { QrLocationService } from '../qr-location-service/qr-location.service';
import { Column } from 'src/app/shared/master-table/master-table.types';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public faEdit = faEdit;
  public faSpinner = faSpinner;
  public faScrewdriver = faScrewdriver;
  public faMap = faMap;
  public allRecords: any[] = [];
  public recordsToShow: any[] = [];
  public loading = true;
  public columns: Column[] = [
    {
      key: 'name',
      title: 'Nombre',
    },
    {
      key: 'is_active',
      title: 'Activo',
    },
    {
      key: 'created_at',
      title: 'Fecha de creación',
    },
  ]

  constructor(
    public QrLocationService: QrLocationService
  ) { }

  ngOnInit(): void {
    this.getAllData().catch((error) => {
      console.error(error);
    }).finally(() => {
      this.loading = false;
    });
  }

  async getAllData() {
    const placeId = localStorage.getItem('CURRENT_PLACE')
    this.allRecords = await this.QrLocationService.find({ place_id: placeId });
  }

  updateRecordsToShow(record: any[]) {
    this.recordsToShow = record;
  }


}
