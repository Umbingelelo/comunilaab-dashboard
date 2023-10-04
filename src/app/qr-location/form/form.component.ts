import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PlaceService } from '../../store/place-service/place-service.service';
import { QrLocationService } from '../qr-location-service/qr-location.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public faSpinner = faSpinner;
  public loading = true;
  public formType = 'create';
  public currentPlace: any;
  public currentQrLocation: any;
  public wasSubmitted = false;

  public qrLocationForm = this.FormBuilder.group({
    name: ['', [Validators.required]],
    is_active: [true, [Validators.required]],
    place_id: [0, [Validators.required]],
    xAxis: [0, [Validators.required, Validators.min(1)]],
    yAxis: [0, [Validators.required, Validators.min(1)]],
    url: ['example']
  });

  constructor(
    public FormBuilder: FormBuilder,
    public PlaceService: PlaceService,
    public QrLocationService: QrLocationService,
    public Router: Router,
    public ActivatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe(async (ParamsMap: any) => {
      const { params } = ParamsMap;
      const { id } = params;
      const placeId = this.checkModeAndGetPlaceId(id);
      this.getAllData(placeId, id).then(() => {
        this.setAllData(placeId);
      }).catch((error) => {
        console.error(error);
      })
    });
  }

  checkModeAndGetPlaceId(id: any) {
    this.formType = id ? 'edit' : 'create';
    const placeIdStr = localStorage.getItem('CURRENT_PLACE')
    if (!placeIdStr) throw new Error('Place not found');
    return parseInt(placeIdStr, 10);
  }

  async getAllData(placeId: any, qrLocationId?: any) {
    this.currentPlace = await this.PlaceService.findById(placeId);
    if (this.formType === 'edit') {
      this.currentQrLocation = await this.QrLocationService.findById(qrLocationId)
    }
  }

  setAllData(placeId: any) {
    if (this.formType === 'edit') {
      this.qrLocationForm.patchValue(this.currentQrLocation);
    }
    const values = { place_id: placeId };
    this.qrLocationForm.patchValue(values);
    this.loading = false;
  }

  submit() {
    this.wasSubmitted = true;
    if (this.qrLocationForm.valid) {
      if (this.formType === 'create') {
        this.QrLocationService.new(this.qrLocationForm.value).then((response: any) => {
          this.Router.navigate(['/qrlocation', response.id]);
        }).catch((error) => {
          console.error(error);
        })
      } else {
        this.QrLocationService.update(this.currentQrLocation.id, this.qrLocationForm.value).then((response: any) => {
          this.Router.navigate(['/qrlocation', response.id]);
        }).catch((error) => {
          console.error(error);
        })
      }
    }
  }

  paintCircle(event: MouseEvent) {
    const { offsetX, offsetY } = event;
    this.hideNode();
    this.createNode(offsetX, offsetY, true)
  }

  createNode(offsetX: number, offsetY: number, isRelative = true) {
    const map = document.getElementById('map') as HTMLImageElement;
    if (!map) throw new Error('Map not found');
    const circle = this.getNodePosition(offsetX, offsetY, isRelative);
    this.qrLocationForm.patchValue({
      xAxis: circle.x,
      yAxis: circle.y,
    });
    this.modifyHtmlNode(circle);
  }

  getNodePosition(x: number, y: number, isRelative: boolean) {
    const map = document.getElementById('map') as HTMLImageElement;
    if (!map) throw new Error('Map not found');
    const naturalHeight = map.naturalHeight;
    const naturalWidth = map.naturalWidth;
    const sizedHeight = map.height;
    const sizedWidth = map.width;
    const realX = isRelative ? (Number(x) * naturalWidth / sizedWidth) : x;
    const realY = isRelative ? (Number(y) * naturalHeight / sizedHeight) : y;
    const relativeX = isRelative ? x : (Number(x) * sizedWidth / naturalWidth);
    const relativeY = isRelative ? y : (Number(y) * sizedHeight / naturalHeight);
    return {
      x: realX,
      y: realY,
      relativeX,
      relativeY,
    }
  }

  modifyHtmlNode(circle: any) {
    const { relativeX, relativeY } = circle;
    const node = document.getElementById('node');
    if (node) {
      node.style.top = `${relativeY}px`;
      node.style.left = `${relativeX}px`;
      node.style.display = 'block';
      node.style.width = '20px';
      node.style.height = '20px';
      node.style.transform = 'translate(-50%, -50%)';
    }
  }

  hideNode() {
    const map = document.getElementById('map') as HTMLImageElement;
    if (!map) throw new Error('Map not found');
    const node = document.getElementById('node');
    if (node) {
      node.style.display = 'none';
    }
  }

  hasError(field: string, error: string) {
    const control = this.qrLocationForm.get(field);
    if (!control) return false;
    return this.wasSubmitted && control.hasError(error);
  }

  loadDotInImage() {
    if (this.formType === 'create') return;
    this.createNode(this.currentQrLocation.xAxis, this.currentQrLocation.yAxis, false);
  }

}
