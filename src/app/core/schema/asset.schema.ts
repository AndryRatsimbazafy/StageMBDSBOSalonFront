import { EntityState } from '@ngrx/entity';

export interface AssetEntry {
    _id: string;
    idExposant: string;
    logo: any;
    videos: [any];
    flyers: [any];
    gallery: [any];
    createdAt?: any;
}

export interface AssetState extends EntityState<AssetEntry> {
    loading: boolean;
    listEntries: AssetEntry[];
    errorMessage?: string;
    asset: AssetEntry;
    uploading: boolean;
    uploadedBytes: number; 
}
