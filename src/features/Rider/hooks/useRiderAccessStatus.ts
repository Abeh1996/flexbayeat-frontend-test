// src/features/Rider/hooks/useRiderAccessStatus.ts
'use client';
import { useRiderProfileQuery } from './useRiderProfileQuery';

export type RiderAccessState =
  | 'loading'
  | 'error'
  | 'no_profile'
  | 'pending'
  | 'active'
  | 'rejected';

export function useRiderAccessStatus() {
  const { riderProfile, isLoadingRiderProfile, isErrorRiderProfile } =
    useRiderProfileQuery();

  let state: RiderAccessState = 'loading';

  if (!isLoadingRiderProfile && !riderProfile && !isErrorRiderProfile) {
    state = 'no_profile';
  } else if (isErrorRiderProfile) {
    state = 'error';
  } else if (!isLoadingRiderProfile && riderProfile) {
    switch (riderProfile.status) {
      case 'PENDING_APPROVAL':
        state = 'pending';
        break;
      case 'APPROVED':
      case 'ACTIVE':
        state = 'active';
        break;
      case 'REJECTED':
      case 'SUSPENDED':
        state = 'rejected';
        break;
      default:
        state = 'rejected';
    }
  }

  return {
    state,
    isLoading: isLoadingRiderProfile,
    riderProfile,
    rejectionReason:
      riderProfile?.rejectionReason || riderProfile?.suspensionReason || undefined,
  };
}