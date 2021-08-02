import { EntityState } from '@ngrx/entity';

export interface ContentEntry {
    _id?: string;
    content: Content;
}

export interface Content {
    types?: [ContentValue];
    variantes?: [ContentValue];
    mob?: [ContentValue];
    personnages?: [ContentValue];
}

export interface ContentValue {
    _id?: string;
    idTypes?: string;
    maxPersonnage?: number;
    maxEcran?: number;
    name: string;
    url: string;
    videoPreviewUrl?: string;
    selected: boolean;
    uncheckable?: boolean;
    types?: [string];
}

export interface ContentState extends EntityState<ContentEntry> {
    loading: boolean;
    isSaving: boolean;
    errorMessage?: string;
}

