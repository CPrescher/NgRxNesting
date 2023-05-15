import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromProject from './reducers';
import {reducer} from "./reducers";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromProject.projectFeatureKey, reducer)
  ]
})
export class ProjectModule { }
