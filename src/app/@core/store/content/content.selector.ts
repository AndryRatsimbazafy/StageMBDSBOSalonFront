import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromContent from './content.reducer';
import { ContentState } from '../../schema/content.schema';

export const getRouteState = createFeatureSelector<ContentState>('contents');

export const selectContentState = createSelector(
  getRouteState,
  (state) => state
);

export const selectAllContents = createSelector(
  selectContentState,
  fromContent.selectAll
);

export const selectAllContentIds = createSelector(
    selectContentState,
    fromContent.selectIds
  );

export const selectContentId = createSelector(selectAllContents, (entries) => {
  return entries.map((entry) => entry._id);
});

export const selectContentLoading = createSelector(
  selectContentState,
  ({ loading }) => loading
);

export const selectContentSaving = createSelector(
  selectContentState,
  ({ isSaving }) => isSaving
);

// select the default inserted content object (contents[0])
export const selectDefaultContent = createSelector(
  selectAllContents,
  (entries) => {
    return entries.filter((value, index) => index === 0).map((entry) => entry.content);
  }
);

export const selectContentTypes = createSelector(
  selectAllContents,
  (entries) => {
    return entries.map((entry) => entry.content.types);
  }
);

export const selectContentVariantes = createSelector(
  selectAllContents,
  (entries) => {
    return entries.map((entry) => entry.content.variantes);
  }
);

export const selectContentMob = createSelector(
  selectAllContents,
  (entries) => {
    return entries.map((entry) => entry.content.mob);
  }
);

export const selectContentPersonnage = createSelector(
  selectAllContents,
  (entries) => {
    return entries.map((entry) => entry.content.personnages);
  }
);
