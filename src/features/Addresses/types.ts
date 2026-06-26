// src/features/Addresses/types.ts

export interface Address {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  deliveryInstructions?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface AddressPayload {
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  deliveryInstructions?: string;
  isDefault: boolean;
}

// Geoapify autocomplete/reverse geocode response shape
export interface GeoapifyFeature {
  properties: {
    place_id: string;
    formatted: string;
    name?: string;
    street?: string;
    housenumber?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country_code?: string;
    lat: number;
    lon: number;
  };
}