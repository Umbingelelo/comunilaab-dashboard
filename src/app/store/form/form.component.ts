import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../categories-service/category-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceService } from '../place-service/place-service.service';
import { LocationService } from '../location-service/location-service.service';
import { StoreService } from '../store-service/store-service.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public loading = true;
  public isCreating = false;

  public faSpinner = faSpinner;

  public type: 'create' | 'edit' = 'create';

  public currentStore: any | undefined;
  public currentPlace: any | undefined;

  public storeFormErrors: Record<string, boolean> = {};
  public storeForm = this.fb.group({
    place_id: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required]],
    is_active: [true, [Validators.required]],
    time: ['', [Validators.required]],
    type: ['store', [Validators.maxLength(255)]]
  });

  public allCategories: Record<string, string>[] = []
  public selectedCategories: Record<string, string>[] = []
  public inputCategory = '';

  public logoSelected: File | undefined;
  public logoImagePreview = '';

  public pictureSelected: File | undefined;
  public pictureImagePreview = '';

  public mapSelected: File | undefined;
  public mapImagePreview = '';
  public placeMap = {
    width: 0,
    height: 0
  }
  public hasValidMapDimensions = true;

  public showCircle = false;
  public circlePosition = {};
  public circleDataToSave = {
    xAxis: 0,
    yAxis: 0,
    alias: ''
  }

  constructor(
    private fb: FormBuilder,
    public CategoryService: CategoryService,
    public ActivatedRoute: ActivatedRoute,
    public PlaceService: PlaceService,
    public LocationService: LocationService,
    public StoreService: StoreService,
    public Router: Router,
    public http: HttpClient
  ) { }


  ngOnInit(): void {
    this.getAllData().catch((error) => {
      console.error(error)
    });
  }

  async getAllData() {
    await this.checkAndConfigureEditMode();
    await this.getRequiredInfo();
    this.loading = false;
  }

  putCircleIfIsEdit() {
    if (this.type === 'create') return;
    this.LocationService.findById(this.currentStore.location_id).then((currentLocation) => {
      this.paintCircle(currentLocation.xAxis, currentLocation.yAxis, true);
      this.circleDataToSave.alias = currentLocation.alias;
    }).catch((error) => {
      console.log(error)
    })
  }

  async checkAndConfigureEditMode() {
    const { id } = this.ActivatedRoute.snapshot.params;
    if (!id) return;
    this.type = 'edit';
    this.currentStore = await this.StoreService.findById(id)
    this.selectedCategories = await this.CategoryService.find({ store_id: id });
    this.setStoreValuesInForm();
  }

  setStoreValuesInForm() {
    const store = this.currentStore;
    this.storeForm.controls['name'].setValue(store.name);
    this.storeForm.controls['description'].setValue(store.description);
    this.storeForm.controls['is_active'].setValue(store.is_active);
    this.storeForm.controls['time'].setValue(store.time.replace(';', '\n'));
    this.storeForm.controls['type'].setValue(store.type);
    this.storeForm.controls['place_id'].setValue(store.place_id);
  }

  async getRequiredInfo() {
    const placeInURL = this.ActivatedRoute.snapshot.params['place_id'];
    const placeId = placeInURL ? placeInURL : this.currentStore.place_id;
    this.storeForm.controls['place_id'].setValue(placeId);
    this.currentPlace = await this.PlaceService.findById(placeId);
    this.getMapDimensions();
    const categories = await this.CategoryService.all();
    this.filterAndSortCategories(categories)
  }

  onFileSelected(event: any, type: 'logo' | 'picture' | 'map'): void {
    if (!event.target.files[0]) return;
    const fileSelected = <File>event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      switch (type) {
        case 'logo':
          this.logoSelected = fileSelected;
          this.logoImagePreview = URL.createObjectURL(this.logoSelected);
          this.storeFormErrors['logo'] = false;
          break;
        case 'picture':
          this.pictureSelected = fileSelected;
          this.pictureImagePreview = URL.createObjectURL(this.pictureSelected);
          this.storeFormErrors['picture'] = false;
          break;
        case 'map':
          this.mapSelected = fileSelected;
          this.mapImagePreview = URL.createObjectURL(this.mapSelected);
          this.storeFormErrors['map'] = false;
          this.checkMapDimensions();
          this.storeFormErrors['mapDimensions'] = !this.hasValidMapDimensions;
          break;
      }
    };
    reader.readAsDataURL(fileSelected);
  }

  clearImage(type: 'logo' | 'picture' | 'map'): void {
    switch (type) {
      case 'logo':
        this.logoSelected = undefined;
        if (this.currentStore) this.currentStore.logo_link = '';
        this.logoImagePreview = '';
        this.storeFormErrors['logo'] = true;
        break;
      case 'picture':
        this.pictureSelected = undefined;
        if (this.currentStore) this.currentStore.picture = '';
        this.pictureImagePreview = '';
        this.storeFormErrors['picture'] = true;
        break;
      case 'map':
        this.mapSelected = undefined;
        if (this.currentStore) this.currentStore.map_store_link = '';
        this.mapImagePreview = '';
        this.storeFormErrors['map'] = true;
        break;
    }
  }

  filterAndSortCategories(allCategories: any) {
    const uniqueCategories = allCategories.filter((category: any, index: number, self: any) =>
      index === self.findIndex((categoryToCompare: any) => (
        categoryToCompare.name === category.name
      )))
    uniqueCategories.sort((category: any, categoryToCompare: any) => category.name.localeCompare(categoryToCompare.name))
    this.allCategories = uniqueCategories
  }

  deleteCategory(category: any) {
    this.selectedCategories = this.selectedCategories.filter((categoryToCompare) => categoryToCompare['name'] !== category.name);
  }

  addTextCategory() {
    if (this.inputCategory.replace(' ', '') === '') return;
    this.selectedCategories.push({ name: this.inputCategory })
    this.inputCategory = '';
  }

  addCategory(event: any) {
    this.selectedCategories.push({ name: event.target.value })
    this.inputCategory = '';
  }

  paintCircleOnClick(event: MouseEvent) {
    this.paintCircle(event.offsetX, event.offsetY)
  }

  paintCircle(offsetX: number, offsetY: number, fromDB = false) {
    const mapExisting = document.getElementById('mapToSelectExisting') as HTMLImageElement;
    const mapPreview = document.getElementById('mapToSelectPreview') as HTMLImageElement;
    const map = mapExisting ? mapExisting : mapPreview;
    const naturalHeight = map.naturalHeight;
    const naturalWidth = map.naturalWidth;
    const sizedHeight = map.height;
    const sizedWidth = map.width;
    if (fromDB) {
      offsetX = (offsetX) * sizedWidth / naturalWidth;
      offsetY = (offsetY) * sizedHeight / naturalHeight;
    }
    this.circlePosition = {
      'left': offsetX - 10 + 'px',
      'top': offsetY - 10 + 'px'
    };
    this.circleDataToSave = {
      xAxis: (Number(offsetX) * naturalWidth / sizedWidth),
      yAxis: (Number(offsetY) * naturalHeight / sizedHeight),
      alias: ''
    }
    this.showCircle = true;
  }

  async uploadFileToS3(storeId: number, image: File, fileName: string) {
    const fd = new FormData();
    fd.append('file', image, fileName);
    return this.StoreService.uploadFile(storeId, fd);
  }

  createStore() {
    if (this.type === 'create') {
      this.createAllThings().then(() => {
        return this.Router.navigate(['/store', this.currentStore.id])
      }).catch((error) => {
        console.log(error)
      });
    } else {
      this.updateAllThings().then(() => {
        return this.Router.navigate(['/store', this.currentStore.id])
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  checkFormIsValid() {
    this.storeFormErrors = {}
    let isValid = true;
    if (!this.storeForm.valid) {
      isValid = false;
    }
    if (!this.logoImagePreview && (!this.currentStore || !this.currentStore.logo_link)) {
      this.storeFormErrors['logo'] = true;
      isValid = false;
    }
    if (!this.pictureImagePreview && (!this.currentStore || !this.currentStore.picture)) {
      this.storeFormErrors['picture'] = true;
      isValid = false;
    }
    if (this.selectedCategories.length === 0) {
      this.storeFormErrors['categories'] = true;
      isValid = false;
    }
    if (!this.circlePosition) {
      this.storeFormErrors['location'] = true;
      isValid = false;
    }
    if (!this.mapImagePreview && (!this.currentStore || !this.currentStore.map_store_link)) {
      this.storeFormErrors['map'] = true;
      isValid = false;
    }
    this.checkMapDimensions();
    if (!this.hasValidMapDimensions) {
      this.storeFormErrors['mapDimensions'] = true;
      isValid = false;
    }
    return isValid;
  }

  getMapDimensions() {
    if (!this.currentPlace.map_link) return;
    const map = new Image();
    map.src = this.currentPlace.map_link;
    map.onload = () => {
      this.placeMap.width = map.width;
      this.placeMap.height = map.height;
    }
  }

  checkMapDimensions() {
    if (!this.mapImagePreview || !this.currentPlace.map_link) return;
    const mapExisting = document.getElementById('mapToSelectExisting') as HTMLImageElement;
    const mapPreview = document.getElementById('mapToSelectPreview') as HTMLImageElement;
    const map = mapExisting ? mapExisting : mapPreview;
    if (map) {
      const naturalHeight = map.naturalHeight;
      const naturalWidth = map.naturalWidth;
      if (naturalWidth == this.placeMap.width && naturalHeight == this.placeMap.height) {
        this.hasValidMapDimensions = true;
        this.storeFormErrors['mapDimensions'] = false;
      } else {
        this.hasValidMapDimensions = false;
        this.storeFormErrors['mapDimensions'] = true;
      }
    }
  }

  getErrorInForm(field: 'name' | 'type' | 'description' | 'time') {
    if (!this.storeForm.dirty) return false;
    return this.storeForm.controls[field].errors
  }

  async createAllThings() {
    if (!this.checkFormIsValid()) throw new Error('Form is not valid');
    this.isCreating = true;
    const newLocation = await this.LocationService.new(this.circleDataToSave);
    const storeFormValues = this.storeForm.value;
    const params = { ...storeFormValues, location_id: newLocation.id, }
    if (params['time']) params['time'] = params['time'].replace(/\n/g, ';');
    this.currentStore = await this.StoreService.new(params);
    await this.createAllCategories();
    await this.updateImages();
  }

  async updateAllThings() {
    if (!this.checkFormIsValid()) throw new Error('Form is not valid');
    this.isCreating = true;
    await this.updateImages();
    await this.LocationService.update(this.currentStore.location_id, this.circleDataToSave);
    await this.createAllCategories();
    const params = this.storeForm.value;
    if (params['time']) params['time'] = params['time'].replace(/\n/g, ';');
    await this.StoreService.update(this.currentStore.id, params);
  }

  async updateImages() {
    if (this.logoSelected) {
      const logoImage = await this.uploadFileToS3(this.currentStore.id, this.logoSelected, 'logo')
      await this.StoreService.update(this.currentStore.id, { logo_link: logoImage['location'] })
    }
    if (this.pictureSelected) {
      const pictureImage = await this.uploadFileToS3(this.currentStore.id, this.pictureSelected, 'picture');
      await this.StoreService.update(this.currentStore.id, { picture: pictureImage['location'] })
    }
    if (this.mapSelected) {
      const mapImage = await this.uploadFileToS3(this.currentStore.id, this.mapSelected, 'map');
      await this.StoreService.update(this.currentStore.id, { map_store_link: mapImage['location'] })
    }
  }

  async createAllCategories() {
    const currentCategories = await this.CategoryService.find({ store_id: this.currentStore.id });
    const { notCreatedCategories, toDeleteCategoriesIds } = this.getCategoriesData(currentCategories);
    await this.CategoryService.deleteByStore(this.currentStore.id, { ids: toDeleteCategoriesIds });
    if (notCreatedCategories.length === 0) return;
    await this.CategoryService.new(notCreatedCategories);
  }

  getCategoriesData(currentCategories: any) {
    const formatCategoriesToSave = this.selectedCategories.map((category) => {
      return { name: category['name'], store_id: this.currentStore.id }
    })
    const notCreatedCategories = formatCategoriesToSave.filter((newCategory) => {
      return !currentCategories.find((currentCategory: any) => {
        return currentCategory.name === newCategory.name
      })
    });
    const toDeleteCategories = currentCategories.filter((currentCategory: any) => {
      return !formatCategoriesToSave.find((newCategory) => {
        return currentCategory.name === newCategory.name
      })
    });
    const toDeleteCategoriesIds = toDeleteCategories.map((category: any) => category.id);
    return { notCreatedCategories, toDeleteCategoriesIds }
  }

  cancelAction() {
    switch (this.type) {
      case 'create':
        return this.Router.navigate(['/place', this.currentPlace.id])
      case 'edit':
        return this.Router.navigate(['/store', this.currentStore.id])
    }
  }

}
