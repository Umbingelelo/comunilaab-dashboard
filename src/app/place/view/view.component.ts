import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceService } from '../../store/place-service/place-service.service';
import { PlaceSectionsService } from '../place-sections-service/place-sections-service.service';
import { StoreService } from '../../store/store-service/store-service.service';
import { faCheck, faX, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { LocationService } from '../../store/location-service/location-service.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  public faCheck = faCheck;
  public faX = faX;
  public faSpinner = faSpinner;
  public currentPlace: any = {};
  public placeSections: any = {};
  public hasSectionsDefined = false;
  public allStores: any[] = [];
  public allLocations: any[] = [];
  public loading = true;
  public currentSections = [
    {
      key: 'map',
      title: 'Visualizador Mapas'
    }, {
      key: 'info',
      title: 'Información'
    }, {
      key: 'stores',
      title: 'Visualizar Tiendas'
    }
  ];

  public imageRefresher = '';

  constructor(
    public ActivatedRoute: ActivatedRoute,
    public PlaceService: PlaceService,
    public PlaceSectionsService: PlaceSectionsService,
    public StoreService: StoreService,
    public LocationService: LocationService
  ) { }

  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe((ParamsMap: any) => {
      const { params } = ParamsMap;
      const { id } = params;
      this.imageRefresher = '?' + new Date().getTime();
      this.getAllData(id).then(() => {
        this.loading = false;
      }).catch((error) => {
        console.log(error);
      })
    });
  }

  async getAllData(placeId: any) {
    this.currentPlace = await this.PlaceService.findById(placeId);
    this.allStores = await this.StoreService.find({ place_id: this.currentPlace.id })
    const tempSections = await this.PlaceSectionsService.find({ place_id: placeId });
    const locationsIds = this.allStores.map((store: any) => store.location_id);
    const nonFilteredLocations = await this.LocationService.all();
    this.allLocations = nonFilteredLocations.filter((location: any) => locationsIds.includes(location.id));
    if (tempSections.length > 0) {
      this.placeSections = tempSections[0];
      this.hasSectionsDefined = true;
    } else {
      this.placeSections = {};
    }
  }

  graphNodes() {
    const { map_nodes } = this.currentPlace;
    if (!map_nodes) return;
    if (map_nodes.length === 0) return;
    const map = document.getElementById('map') as HTMLImageElement;
    if (!map) throw new Error('Map not found');
    map_nodes.forEach((node: any) => {
      const [x, y] = node;
      const { relativeX, relativeY } = this.getNodePositionInformation(x, y, false);
      this.createNode(relativeX, relativeY);
    })
    this.allLocations.forEach((location: any) => {
      const { xAxis, yAxis } = location;
      const { relativeX, relativeY } = this.getNodePositionInformation(xAxis, yAxis, false);
      this.createNode(relativeX, relativeY, '#16a34a');
    })

  }

  createNode(offsetX: number, offsetY: number, backgroundColor?: string) {
    const circle = this.getNodePositionInformation(offsetX, offsetY, true);
    const node = this.generateHTMLNode(circle, backgroundColor);
    const map = document.getElementById('map') as HTMLImageElement;
    if (!map) throw new Error('Map not found');
    map.parentElement?.appendChild(node);
  }

  generateHTMLNode(circle: any, backgroundColor?: string) {
    const { relativeX, relativeY, id } = circle;
    const node = document.createElement('div');
    node.id = `node-${id}`;
    node.style.top = `${relativeY}px`;
    node.style.left = `${relativeX}px`;
    node.style.position = 'absolute';
    node.style.backgroundColor = backgroundColor || 'rgb(256,256, 256)';
    node.style.border = '3px solid black';
    node.style.width = `${window.innerWidth / 90}px`;
    node.style.height = `${window.innerWidth / 90}px`;
    node.style.borderRadius = '50%';
    node.style.transform = 'translate(-50%, -50%)';
    node.style.zIndex = '2';
    return node;
  }

  getNodePositionInformation(x: number, y: number, isRelative: boolean) {
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

}
