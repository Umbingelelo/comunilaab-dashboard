import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceService } from '../../store/place-service/place-service.service';
import { StoreService } from 'src/app/store/store-service/store-service.service';
import { differentTypes } from '../types';
import { InformationService } from '../information-service/information-service.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';

function urlOrEmptyValidator(control: AbstractControl): { [key: string]: any } | null {
  const value = control.value;
  const isValidUrl = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(value);
  if (!value || isValidUrl) return null;
  return { 'invalidUrl': true };
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public faSpinner = faSpinner;

  public formType: 'create' | 'edit' = 'create';

  public differentTypes = differentTypes;

  public informationForm = this.FormBuilder.group({
    title: ['', [Validators.required]],
    subtitle: ['', [Validators.required]],
    description: ['', [Validators.required]],
    type: ['', [Validators.required]],
    store_id: [''],
    is_active: [true, [Validators.required]],
    view_more: ['', [urlOrEmptyValidator]],
  });

  public allStores: any = [];
  public currentInformationId: any = null;
  public placeId: any = null;

  public imageSelected: any = null;
  public imagePreview: any = null;
  public imageModified = false;

  public loading = true;

  constructor(
    public activatedRoute: ActivatedRoute,
    public PlaceService: PlaceService,
    public StoreService: StoreService,
    public InformationService: InformationService,
    public Router: Router,
    public http: HttpClient,
    public FormBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    const isEdit = this.Router.url.split('/')[3] === 'edit';
    this.formType = isEdit ? 'edit' : 'create';
    const { place_id, id } = this.activatedRoute.snapshot.params;
    this.placeId = place_id;
    this.getAllData(id).catch((error) => {
      console.error(error)
    }).finally(() => {
      this.loading = false;
    });
  }

  async getAllData(informationId: any) {
    this.loading = true;
    await this.checkAndConfigureEditMode(informationId);
    this.allStores = await this.StoreService.find({ place_id: this.placeId });
  }

  async checkAndConfigureEditMode(informationId: any) {
    if (!informationId) return;
    const informationRecord = await this.InformationService.findById(informationId);
    this.currentInformationId = informationId;
    this.placeId = informationRecord.place_id;
    this.informationForm.patchValue(informationRecord);
    if (informationRecord.img_link) {
      this.imageSelected = await this.fetchImageFile(informationRecord.img_link, 'photo');
      this.imagePreview = URL.createObjectURL(this.imageSelected);
    }
  }

  async fetchImageFile(imageUrl: any, filename: string) {
    const blob = await this.http.get(imageUrl, { responseType: 'blob' }).toPromise();
    if (!blob) return;
    return this.convertBlobToFile(blob, filename);
  }

  convertBlobToFile(blob: any, filename: any) {
    const file = new File([blob], filename, { type: blob.type });
    return file;
  }

  getTypesForSelect() {
    return Object.keys(this.differentTypes);
  }

  submit() {
    if (this.informationForm.valid) {
      this.loading = true;
      this.saveOrUpdate().catch((error) => {
        console.error(error);
      })
    }
  }

  async saveOrUpdate() {
    const valueToSave = this.getFormValues();
    if (this.formType === 'edit') {
      const information = await this.InformationService.update(this.currentInformationId, valueToSave);
      await this.updateImage(information.id);
      return this.Router.navigate(['/information', information.id]);
    } else {
      const newInformationRecord = await this.InformationService.new(valueToSave);
      await this.updateImage(newInformationRecord.id);
      return this.Router.navigate(['/information', newInformationRecord.id]);
    }
  }

  getFormValues() {
    const formValues = this.informationForm.value;
    const valueToSave: any = {
      ...formValues,
      place_id: this.placeId,
      store_id: typeof formValues.store_id === 'string' && formValues.store_id.length === 0 ? null : formValues.store_id,
    };
    if (this.formType === 'create') valueToSave.img_link = 'example';
    return valueToSave;
  }

  async updateImage(informationId: any) {
    if (this.formType === 'create' || (this.formType === 'edit' && this.imageModified)) {
      const fd = new FormData();
      fd.append('file', this.imageSelected, 'photo');
      const { location } = await this.InformationService.uploadFile(informationId, fd);
      await this.InformationService.update(informationId, { img_link: location });
    }
  }

  onFileSelected(event: any): void {
    if (!event.target.files[0]) return;
    const fileSelected = <File>event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageSelected = fileSelected;
      this.imagePreview = URL.createObjectURL(this.imageSelected);
    };
    reader.readAsDataURL(fileSelected);
  }

  clearImage(): void {
    this.imageSelected = undefined;
    this.imagePreview = '';
    this.imageModified = true;
  }

  checkErrorInForm(field: string): boolean {
    const control = this.informationForm.get(field);
    if (!control) return false;
    return control.invalid && (control.dirty || control.touched);
  }

}
