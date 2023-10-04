import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../../store/place-service/place-service.service';
import { Column } from 'src/app/shared/master-table/master-table.types';
import { faEdit, faSpinner, faScrewdriver, faMap } from '@fortawesome/free-solid-svg-icons';

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
    public PlaceService: PlaceService
  ) { }

  ngOnInit(): void {
    this.getAllData().catch((error) => {
      console.error(error);
    }).finally(() => {
      this.loading = false;
    });
  }

  async getAllData() {
    this.allRecords = await this.PlaceService.find({});
  }

  updateRecordsToShow(record: any[]) {
    this.recordsToShow = record;
  }

}
