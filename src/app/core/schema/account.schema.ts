import { EntityState } from '@ngrx/entity';

export interface AccountLogin {
    email: string;
    password: string;
}

export interface AccountLogout {
    _id: string;
}

export interface AccountEntry {
    _id?: string;
    email: string;
    password: string;
    age: number,
    gender: string,
    birthDate: Date,
    role: string;
    companyName: string;
    active: boolean;
    standNumber: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    postalCode?: string;
    projects?: string[];
    conferences?: string[];
    coachings?: {
      coachingDate: string,
      coachingHour: string
    };
    coachingDate?: string;
    coachingHour?: string;
    regReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AccountState extends EntityState<AccountEntry> {
    loading: boolean;
    errorMessage?: string;
    account: AccountEntry;
    selectedAccountId: string;
}

export interface UserState extends EntityState<AccountEntry> {
    loading: boolean;
    isSaving: boolean;
    listEntries: AccountEntry[];
    errorMessage?: string;
    userAdded?: AccountEntry;
    user?: AccountEntry;
}
