import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceSectionsService } from '../place-sections-service/place-sections-service.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public loading = true;
  public placeId: any;
  public currentPlaceSection: any;
  public originalValue: any = {}
  public configForm = this.fb.group({
    stores: [true, [Validators.required]],
    map: [true, [Validators.required]],
    info: [true, [Validators.required]],
  });

  constructor(
    public fb: FormBuilder,
    public ActivatedRoute: ActivatedRoute,
    public PlaceSectionsService: PlaceSectionsService,
    public Router: Router
  ) { }

  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe(async (ParamsMap: any) => {
      const { params } = ParamsMap;
      const { id } = params;
      this.originalValue = this.configForm.value;
      this.placeId = parseInt(id);
      const sections = await this.PlaceSectionsService.find({ place_id: this.placeId })
      if (sections.length > 0) {
        this.currentPlaceSection = sections[0];
        this.configForm.patchValue(this.currentPlaceSection);
        this.originalValue = this.configForm.value;
      }
      this.loading = false;
    });
  }

  isValueChanged(): boolean {
    return JSON.stringify(this.originalValue) !== JSON.stringify(this.configForm.value);
  }

  submit() {
    if (this.configForm.invalid) return;
    this.createOrUpdate().catch((error) => {
      console.log(error);
    }).finally(() => {
      this.Router.navigate(['place', this.placeId])
    })
  }

  async createOrUpdate() {
    const formValues = this.configForm.value;
    if (!this.currentPlaceSection) {
      await this.PlaceSectionsService.new({
        ...formValues,
        place_id: this.placeId
      })
    } else {
      await this.PlaceSectionsService.update(
        this.currentPlaceSection.id,
        formValues
      )
    }
  }

}
