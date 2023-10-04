import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PlaceService } from '../../store/place-service/place-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarTriggerService } from 'src/app/shared/sidebar-trigger/sidebar-trigger.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public currentPlace: any;
  public faSpinner = faSpinner;
  public formType: 'create' | 'edit' = 'create';
  public loading = true;
  public imageSelected: any = null;
  public imagePreview: any = null;
  public imageModified = false;

  public placeForm = this.FormBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    pixel: ['example', [Validators.required]],
    is_active: [true, [Validators.required]],
    secure_url: ['', [Validators.required]],
  });

  constructor(
    private FormBuilder: FormBuilder,
    public PlaceService: PlaceService,
    public Router: Router,
    public ActivatedRoute: ActivatedRoute,
    public http: HttpClient,
    public sidebarService: SidebarTriggerService
  ) { }

  ngOnInit(): void {
    const { type } = this.ActivatedRoute.snapshot.data;
    this.formType = type || this.formType;
    if (this.formType === 'edit') {
      this.fillEditForm();
    } else {
      this.loading = false;
    }
  }

  async fillEditForm() {
    this.ActivatedRoute.paramMap.subscribe(async (ParamsMap: any) => {
      try {
        const { params } = ParamsMap;
        const { id } = params;
        this.currentPlace = await this.PlaceService.findById(parseInt(id));
        this.placeForm.patchValue(this.currentPlace);
        this.imageSelected = await this.fetchImageFile(this.currentPlace.map_link + '?' + new Date().getTime(), 'map');
        this.imagePreview = URL.createObjectURL(this.imageSelected);
        this.loading = false;
      } catch (error) {
        console.log(error)
      }
    });
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

  submit() {
    if (this.placeForm.invalid) return;
    if (!this.imageSelected) return;
    this.loading = true;
    this.createPlace().catch((error) => {
      console.log(error);
    }).finally(() => {
      if (!localStorage.getItem('CURRENT_PLACE')) localStorage.setItem('CURRENT_PLACE', this.currentPlace.id);
      this.Router.navigate(['/place', this.currentPlace.id]);
      this.sidebarService.triggerRerender();
    })
  }

  async createPlace() {
    if (this.formType === 'create') {
      this.currentPlace = await this.PlaceService.new(this.placeForm.value);
      const { location } = await this.uploadFileToS3(this.currentPlace.id, this.imageSelected, 'map');
      await this.PlaceService.update(this.currentPlace.id, { map_link: location });
    } else {
      const valuesToSave: any = this.placeForm.value;
      if (this.imageModified) {
        const { location } = await this.uploadFileToS3(this.currentPlace.id, this.imageSelected, 'map');
        valuesToSave.map_link = location;
      } else {
        valuesToSave.map_link = this.currentPlace.map_link;
      }
      await this.PlaceService.update(this.currentPlace.id, valuesToSave);
    }
  }

  async uploadFileToS3(storeId: number, image: File, fileName: string) {
    const fd = new FormData();
    fd.append('file', image, fileName);
    return this.PlaceService.uploadFile(storeId, fd);
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

}
