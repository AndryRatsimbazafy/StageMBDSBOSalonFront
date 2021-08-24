import { createReducer, on } from '@ngrx/store';
import * as contentActions from './content.action';

import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ContentEntry, ContentState } from '../../schema/content.schema';

export const adapter: EntityAdapter<ContentEntry> = createEntityAdapter<ContentEntry>({
  selectId: (entry) => entry._id,
});

export const initialState: ContentState = adapter.getInitialState({
  loading: false,
  isSaving: false,
  errorMessage: undefined,
});

export const contentReducer = createReducer(
  initialState,
  on(contentActions.addContentRequested, (state) => ({
    ...state,
    isSaving: true,
  })),

  on(contentActions.getContentRequested, (state) => ({
    ...state,
    loading: true,
  })),

  on(contentActions.updateContentRequested, (state) => ({
    ...state,
    isSaving: true,
  })),

  on(contentActions.addContentSuccess, (state, { entry }) => {
    return adapter.addOne(entry, {
      ...state,
      loading: false,
    });
  }),

  on(contentActions.getContentSuccess, (state, { entry }) => {
    return adapter.setOne(entry, {
      ...state,
      loading: false,
    });
  }),

  on(contentActions.updateContentSuccess, (state, { entry }) => {
    return adapter.updateOne(
      {
        id: entry._id,
        changes: entry,
      },
      {
        ...state,
        isSaving: false,
      }
    );
  }),

  on(
    contentActions.addContentFail,
    contentActions.getContentFail,
    contentActions.updateContentFail,
    (state, { errorMessage }) => {
      return {
        ...state,
        loading: false,
        isSaving: false,
        errorMessage,
      };
    }
  )
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
