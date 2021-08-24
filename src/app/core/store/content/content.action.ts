import { createAction, props } from '@ngrx/store';
import { ContentEntry } from '../../schema/content.schema';


const source = 'content';

// add content
export const addContentRequested = createAction(
    `[${source}] add content requested`,
    props<{ input: ContentEntry }>()
);

export const addContentSuccess = createAction(
    `[${source}] add content success`,
    props<{ entry: ContentEntry }>()
);

export const addContentFail = createAction(
    `[${source}] add content fail`,
    props<{ errorMessage: any }>()
);

// Get content
export const getContentRequested = createAction(
    `[${source}] get content requested`
);

export const getContentSuccess = createAction(
    `[${source}] get content success`,
    props<{ entry: ContentEntry }>()
);

export const getContentFail = createAction(
    `[${source}] get content fail`,
    props<{ errorMessage: any }>()
);

// update content

export const updateContentRequested = createAction(
    `[${source}] update content requested`,
    props<{ param: string, body: any }>()
);

export const updateContentSuccess = createAction(
    `[${source}] update content success`,
    props<{ entry: ContentEntry }>()
);

export const updateContentFail = createAction(
    `[${source}] update content fail`,
    props<{ errorMessage: any }>()
);
