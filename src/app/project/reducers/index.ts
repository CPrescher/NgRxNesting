import {createAction, createReducer, on, props} from '@ngrx/store';
import {createEntityAdapter, EntityState} from "@ngrx/entity";

export const projectFeatureKey = 'project';

export interface FitItem {
  name: string;
  models: EntityState<Model>
}

export interface Model {
  name: string;
  parameters: EntityState<Parameter>;
}

export interface Parameter {
  name: string;
  value: number;
}

export interface State extends EntityState<FitItem> {
  name: string;
  currentIndex: number | undefined;
}

export const adapter = createEntityAdapter<FitItem>();
export const ModelAdapter = createEntityAdapter<Model>();
export const ParameterAdapter = createEntityAdapter<Parameter>();

export const initialState: State = adapter.getInitialState({name: '', currentIndex: undefined});

export const changeName = createAction(
  "[FIT API] Change Name",
  props<{ name: string }>()
)

export const selectFitItem = createAction(
  "[FIT API] Select Fit Item",
  props<{ index: number | undefined }>()
)

export const addFitItem = createAction(
  "[FIT API] Add Fit Item",
  props<{ name: string }>()
)

export const moveFitItem = createAction(
  "[FIT API] Move Fit Item",
  props<{ index: number, delta: number }>()
)

export const removeFitItem = createAction(
  "[FIT API] Remove Fit Item",
  props<{ index: number }>()
)

export const addModel = createAction(
  "[FIT API] Add Model",
  props<{ itemIndex: number, name: string }>()
)

export const addModelCurrent = createAction(
  "[FIT API] Add Model Current",
  props<{ name: string }>()
)

export const removeModel = createAction(
  "[FIT API] Remove Model",
  props<{ itemIndex: number, modelIndex: number }>()
)

export const addParameter = createAction(
  "[FIT API] Add Parameter",
  props<{ itemIndex: number, modelIndex: number, name: string }>()
)

export const removeParameter = createAction(
  "[FIT API] Remove Parameter",
  props<{ itemIndex: number, modelIndex: number, parameterIndex: number }>()
)

export const updateParameter = createAction(
  "[FIT API] Update Parameter",
  props<{ itemIndex: number, modelIndex: number, parameterIndex: number, name: string }>()
)


export const reducer = createReducer(
  initialState,
  on(changeName, (state, action) => {
    return {...state, name: action.name}
  }),
  on(selectFitItem, (state, action) => {
    return {...state, currentIndex: action.index}
  }),
  on(addFitItem, (state, action) => {
    const item = {
      id: state.ids.length,
      name: action.name,
      models: ModelAdapter.getInitialState(),
    }
    return adapter.addOne(item, state)
  }),

  on(moveFitItem, (state, action) => {
    if (state.ids.length < action.index) {
      return state;
    }
    const ids = state.ids.slice();
    const new_index = action.index + action.delta;
    ids[action.index] = state.ids[new_index];
    ids[new_index] = state.ids[action.index];
    return {...state, ids: ids};
  }),

  on(removeFitItem, (state, action) => {
    if (state.ids.length < action.index) {
      return state;
    }
    return adapter.removeOne(action.index, state)
  }),

  on(addModel, (state, action) => {
    const item = state.entities[action.itemIndex];
    if (item == undefined) {
      return state;
    }
    const model = {
      id: item.models.ids.length,
      name: action.name,
      parameters: ParameterAdapter.getInitialState(),
    }
    return adapter.updateOne({id: action.itemIndex, changes: {models: ModelAdapter.addOne(model, item.models)}}, state)
  }),

  on(addModelCurrent, (state, action) => {
    const item = state.entities[state.ids.length - 1];
    if (item == undefined) {
      return state;
    }
    const model = {
      id: item.models.ids.length,
      name: action.name,
      parameters: ParameterAdapter.getInitialState(),
    }
    return adapter.updateOne({
      id: state.ids.length - 1,
      changes: {models: ModelAdapter.addOne(model, item.models)}
    }, state)
  }),

  on(removeModel, (state, action) => {
    const item = state.entities[action.itemIndex];
    if (item == undefined) {
      return state;
    }
    return adapter.updateOne({
      id: action.itemIndex,
      changes: {models: ModelAdapter.removeOne(action.modelIndex, item.models)}
    }, state)
  }),

  on(addParameter, (state, action) => {
    const item = state.entities[action.itemIndex];
    if (item == undefined) {
      return state;
    }
    const model = item.models.entities[action.modelIndex];
    if (model == undefined) {
      return state;
    }
    const parameter = {
      id: model.parameters.ids.length,
      name: action.name,
      value: 0,
    }
    return adapter.updateOne(
      {
        id: action.itemIndex,
        changes: {
          models: ModelAdapter.updateOne({
            id: action.modelIndex,
            changes: {
              parameters: ParameterAdapter.addOne(parameter, model.parameters)
            }
          }, item.models)
        }
      }, state)
  }),

  on(removeParameter, (state, action) => {
    const item = state.entities[action.itemIndex];
    if (item == undefined) {
      return state;
    }
    const model = item.models.entities[action.modelIndex];
    if (model == undefined) {
      return state;
    }
    return adapter.updateOne(
      {
        id: action.itemIndex,
        changes: {
          models: ModelAdapter.updateOne({
            id: action.modelIndex,
            changes: {
              parameters: ParameterAdapter.removeOne(action.parameterIndex, model.parameters)
            }
          }, item.models)
        }
      }, state)
  }),

  on(updateParameter, (state, action) => {
    const item = state.entities[action.itemIndex];
    if (item == undefined) {
      return state;
    }
    const model = item.models.entities[action.modelIndex];
    if (model == undefined) {
      return state;
    }
    const parameter = model.parameters.entities[action.parameterIndex];
    if (parameter == undefined) {
      return state;
    }
    return adapter.updateOne(
      {
        id: action.itemIndex,
        changes: {
          models: ModelAdapter.updateOne({
            id: action.modelIndex,
            changes: {
              parameters: ParameterAdapter.updateOne({
                id: action.parameterIndex,
                changes: {name: action.name}
              }, model.parameters)
            }
          }, item.models)
        }
      }, state)
  }),
);

