import { EntityState } from '@ngrx/entity';
import { ContentValue } from './content.schema';

export interface RoomEntry {
    _id?: string;
    commercial?: [{
        index: number,
        user_id: string
    }];
    color: string;
    visio?: string;
    user_id: string;
    type: ContentValue;
    variant: ContentValue;
    mob: ContentValue;
    characters?: [ContentValue];
}

export interface RoomState extends EntityState<RoomEntry> {
    loading: boolean;
    isSaving: boolean;
    errorMessage?: string;
    userRoom?: RoomEntry;
}

