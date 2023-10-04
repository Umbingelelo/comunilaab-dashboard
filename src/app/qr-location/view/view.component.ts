import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QrLocationService } from '../qr-location-service/qr-location.service';
import { faSpinner, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { PlaceService } from '../../store/place-service/place-service.service';
import { SafeUrl } from '@angular/platform-browser';
import { Dropdown, DropdownInterface } from 'flowbite';
import { QRCodeElementType } from 'angularx-qrcode';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  public faChevronUp = faChevronUp;
  public faChevronDown = faChevronDown;
  public faSpinner = faSpinner;
  public loading = true;
  public currentQrLocation: any;
  public currentPlace: any;
  public elementType: QRCodeElementType = 'svg';
  public route: any;
  public qrSrc: SafeUrl | undefined;
  public dropdown: DropdownInterface | undefined

  constructor(
    public ActivatedRoute: ActivatedRoute,
    public QrLocationService: QrLocationService,
    public PlaceService: PlaceService
  ) { }

  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe((ParamsMap: any) => {
      const { params } = ParamsMap;
      const { id } = params;
      this.getAllData(id).then(() => {
        this.setAllData();
        this.loading = false;
        setTimeout(() => {
          this.configDropdown();
        }, 1);
      }).catch((error) => {
        console.error(error)
      })
    });
  }

  async getAllData(qrLocationId: any) {
    const placeId = localStorage.getItem('CURRENT_PLACE');
    this.currentQrLocation = await this.QrLocationService.findById(qrLocationId);
    this.currentPlace = await this.PlaceService.findById(placeId);
  }

  setAllData() {
    this.generateRoute();
  }

  generateRoute() {
    const secureUrl = this.currentPlace.secure_url || 'av.accionet.net'
    this.route = 'https://' + secureUrl + '/' + this.currentPlace.id + '/' + this.currentQrLocation.id;
  }

  setSvGQrUrl(event: SafeUrl) {
    this.qrSrc = event;
  }

  loadDot() {
    const { xAxis, yAxis } = this.currentQrLocation;
    const map = document.getElementById('map') as HTMLImageElement;
    const naturalHeight = map.naturalHeight;
    const naturalWidth = map.naturalWidth;
    const sizedHeight = map.height;
    const sizedWidth = map.width;
    const relativeX = (Number(xAxis) * sizedWidth / naturalWidth);
    const relativeY = (Number(yAxis) * sizedHeight / naturalHeight);
    this.generateHtmlDot(map, relativeX, relativeY);
  }

  generateHtmlDot(map: any, relativeX: any, relativeY: any) {
    const dot = document.createElement('div');
    dot.style.top = relativeY + 'px';
    dot.style.left = relativeX + 'px';
    dot.style.position = 'absolute';
    dot.style.width = '13px';
    dot.style.height = '13px';
    dot.style.backgroundColor = 'green';
    dot.style.borderRadius = '50%';
    dot.style.transform = 'translate(-50%, -50%)';
    map.parentElement?.appendChild(dot);
  }

  configDropdown() {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdown');
    const dropdown = new Dropdown(dropdownMenu, dropdownButton, {
      placement: 'bottom',
      triggerType: 'click',
      offsetSkidding: 0,
      offsetDistance: 10,
      delay: 300,
      ignoreClickOutsideClass: false,
    });
    this.dropdown = dropdown;
  }

  saveAsPngImage(parent: any) {
    this.elementType = 'img';
    setTimeout(() => {
      let parentElement = null
      if (this.elementType === "img" || this.elementType === "url") {
        parentElement = parent.qrcElement.nativeElement.querySelector("img").src
      } else {
        console.error("Set elementType to 'canvas', 'img' or 'url'.")
      }
      if (parentElement) {
        const blobData = this.convertBase64ToBlob(parentElement)
        const blob = new Blob([blobData], { type: "image/png" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = 'qr-place' + this.currentPlace.id + '-location-' + this.currentQrLocation.id
        link.click()
      }
      this.elementType = "svg";
    }, 1000);
  }

  private convertBase64ToBlob(Base64Image: string) {
    const parts = Base64Image.split(";base64,")
    const imageType = parts[0].split(":")[1]
    const decodedData = window.atob(parts[1])
    const uInt8Array = new Uint8Array(decodedData.length)
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: imageType })
  }


}
