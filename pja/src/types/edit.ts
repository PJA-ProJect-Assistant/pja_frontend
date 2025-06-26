export interface EditLockOptions {
  field?: string | null;
  fieldId?: string | null;
  page: string;
}

export interface LockedUser {
  userId: number;
  userName: string;
  userProfile: string | null;
  page: string;
  field: string | null;
  fieldId: string | null;
}
