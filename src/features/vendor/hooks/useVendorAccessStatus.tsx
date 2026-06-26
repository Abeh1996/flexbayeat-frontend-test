// src/features/Vendor/hooks/useVendorAccessStatus.ts
'use client';
import { useVendorProfileQuery } from './useVendorProfileQuery';
import { VendorAccessState } from '../types';

export function useVendorAccessStatus() {
  const { vendorProfile, isLoadingVendorProfile, isErrorVendorProfile } = useVendorProfileQuery();

  let state: VendorAccessState = 'loading';

  if (isErrorVendorProfile) {
    state = 'error';
  } else if (!isLoadingVendorProfile && vendorProfile) {
    switch (vendorProfile.status) {
      case 'PENDING_APPROVAL':
        state = 'pending';
        break;
      case 'APPROVED':
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
    isLoading: isLoadingVendorProfile,
    vendorProfile,
    rejectionReason: vendorProfile?.rejectionReason || vendorProfile?.suspensionReason || undefined,
  };
}