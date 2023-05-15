import {Component} from '@angular/core';
import {
  addFitItem,
  addModel,
  addParameter,
  moveFitItem,
  removeFitItem,
  removeModel, selectFitItem,
  State,
  updateParameter
} from "./project/reducers"
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NgRxNesting';

  constructor(
    private store: Store<State>,
  ) {
    this.store.dispatch(addFitItem({name: "test"}))
    this.store.dispatch(addFitItem({name: "test"}))
    this.store.dispatch(addFitItem({name: "test"}))
    this.store.dispatch(addFitItem({name: "test"}))

    this.store.dispatch(moveFitItem({index: 1, delta: -1}))
    this.store.dispatch(removeFitItem({index: 0}))

    this.store.dispatch(addModel({itemIndex: 1, name: "BLUB"}))
    this.store.dispatch(addModel({itemIndex: 1, name: "BLUB"}))
    this.store.dispatch(removeModel({itemIndex: 1, modelIndex: 0}))

    this.store.dispatch(addParameter({itemIndex: 1, modelIndex: 1, name: "PARA"}))
    this.store.dispatch(addParameter({itemIndex: 1, modelIndex: 1, name: "PARA2"}))

    this.store.dispatch(updateParameter({itemIndex: 1, modelIndex: 1, parameterIndex: 0, name: "PARABOLA"}))
    this.store.dispatch(selectFitItem({index: 1}))
    console.log("stareted somes tuff")
  }
}
