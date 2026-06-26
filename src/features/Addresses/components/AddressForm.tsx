// src/features/Addresses/components/AddressForm.tsx
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, LocateFixed, Loader2, X, MapPin } from 'lucide-react';
import { AddressPayload } from '../types';

const GEO_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

// Geoapify response shape
interface GeoapifyFeature {
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

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  region: z.string().min(1, 'Region is required'),
  country: z.string().default('CMR'),
  latitude: z.number({ required_error: 'Select an address from suggestions' }),
  longitude: z.number({ required_error: 'Select an address from suggestions' }),
  deliveryInstructions: z.string().optional(),
  isDefault: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

const inputCls = (err?: boolean) =>
  `w-full px-4 py-3 bg-white border text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors duration-150 ${
    err ? 'border-red-400 focus:border-red-400' : 'border-zinc-200 focus:border-amber-500'
  }`;
const labelCls = 'block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5';
const errorCls = 'text-xs text-red-500 font-medium mt-1';

interface AddressFormProps {
  onSuccess: (payload: AddressPayload) => void;
  isLoading: boolean;
  defaultValues?: Partial<FormValues>;
  submitLabel?: string;
}

export function AddressForm({
  onSuccess,
  isLoading,
  defaultValues,
  submitLabel = 'Save Address',
}: AddressFormProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: 'CMR',
      isDefault: false,
      ...defaultValues,
    },
  });

  const lat = watch('latitude');
  const lng = watch('longitude');

  useEffect(() => {
    if (lat && lng) setShowMap(true);
  }, [lat, lng]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Geoapify autocomplete
  const fetchSuggestions = useCallback(async (value: string) => {
    if (value.length < 3 || !GEO_KEY) {
      setSuggestions([]);
      return;
    }
    setIsFetchingSuggestions(true);
    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        value
      )}&filter=countrycode:cm&limit=5&lang=en&apiKey=${GEO_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data.features ?? []);
    } catch {
      setSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 400);
  };

  const handleSelectSuggestion = (feature: GeoapifyFeature) => {
    const p = feature.properties;
    // Build addressLine1: prefer street+housenumber, fall back to name or suburb
    const addressLine1 =
      [p.housenumber, p.street].filter(Boolean).join(' ') ||
      p.name ||
      p.suburb ||
      p.formatted.split(',')[0];

    setValue('addressLine1', addressLine1, { shouldValidate: true });
    setValue('city', p.city ?? '', { shouldValidate: true });
    setValue('region', p.state ?? '', { shouldValidate: true });
    setValue('latitude', p.lat, { shouldValidate: true });
    setValue('longitude', p.lon, { shouldValidate: true });
    setQuery(p.formatted);
    setSuggestions([]);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowMap(false);
    setValue('addressLine1', '');
    setValue('city', '');
    setValue('region', '');
    // @ts-expect-error — intentionally clearing number field
    setValue('latitude', undefined);
    // @ts-expect-error — intentionally clearing number field
    setValue('longitude', undefined);
  };

  // Reverse geocode detected GPS coords
  const handleDetect = () => {
    if (!navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: detectedLat, longitude: detectedLng } = pos.coords;
        try {
          const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${detectedLat}&lon=${detectedLng}&lang=en&apiKey=${GEO_KEY}`;
          const res = await fetch(url);
          const data = await res.json();
          const feature: GeoapifyFeature | undefined = data.features?.[0];
          if (feature) {
            handleSelectSuggestion(feature);
          } else {
            setValue('latitude', detectedLat, { shouldValidate: true });
            setValue('longitude', detectedLng, { shouldValidate: true });
          }
        } catch {
          setValue('latitude', detectedLat, { shouldValidate: true });
          setValue('longitude', detectedLng, { shouldValidate: true });
        } finally {
          setIsDetecting(false);
        }
      },
      () => setIsDetecting(false),
      { timeout: 10000 }
    );
  };

  const onSubmit = (values: FormValues) => {
    onSuccess({
      label: values.label,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      region: values.region,
      country: values.country,
      latitude: values.latitude,
      longitude: values.longitude,
      deliveryInstructions: values.deliveryInstructions,
      isDefault: values.isDefault,
    });
  };

  // Geoapify static map preview with amber marker
  const mapPreviewUrl =
    lat && lng
      ? `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=200&center=lonlat:${lng},${lat}&zoom=14&marker=lonlat:${lng},${lat};color:%23f59e0b;size:medium&apiKey=${GEO_KEY}`
      : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Label */}
      <div>
        <label className={labelCls}>Address Label</label>
        <input
          {...register('label')}
          placeholder="e.g. Home, Office, Mum's place"
          className={inputCls(!!errors.label)}
        />
        {errors.label && <p className={errorCls}>{errors.label.message}</p>}
      </div>

      {/* Search + Detect */}
      <div>
        <label className={labelCls}>Search Address</label>
        <div className="relative" ref={suggestionsRef}>
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
            <input
              value={query}
              onChange={handleQueryChange}
              placeholder="Search street, neighbourhood, city…"
              className={`${inputCls(!!errors.addressLine1)} pl-10 pr-20`}
            />
            <div className="absolute right-2 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <X size={13} />
                </button>
              )}
              {isFetchingSuggestions && (
                <Loader2 size={14} className="text-zinc-400 animate-spin" />
              )}
              <button
                type="button"
                onClick={handleDetect}
                disabled={isDetecting}
                title="Detect my location"
                className="p-1.5 text-zinc-400 hover:text-amber-500 transition-colors disabled:opacity-40"
              >
                {isDetecting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <LocateFixed size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute z-50 left-0 right-0 top-full mt-0.5 bg-white border border-zinc-200 shadow-md">
              {suggestions.map((feature) => (
                <button
                  key={feature.properties.place_id}
                  type="button"
                  onClick={() => handleSelectSuggestion(feature)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-amber-50 border-b border-zinc-100 last:border-0 transition-colors"
                >
                  <MapPin size={13} className="text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-zinc-700 leading-snug">
                    {feature.properties.formatted}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        {errors.addressLine1 && !query && (
          <p className={errorCls}>Please search and select an address</p>
        )}
        {errors.latitude && (
          <p className={errorCls}>Please select an address from the suggestions</p>
        )}
      </div>

      {/* Map preview — shown after coordinates are set */}
      {showMap && mapPreviewUrl && (
        <div className="border border-zinc-200 overflow-hidden">
          <div className="px-3 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center gap-2">
            <MapPin size={12} className="text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Location Preview
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mapPreviewUrl}
            alt="Map preview of selected address"
            className="w-full h-40 object-cover"
          />
        </div>
      )}

      {/* Address Line 2 */}
      <div>
        <label className={labelCls}>
          Apartment / Floor / Unit{' '}
          <span className="normal-case tracking-normal font-normal text-zinc-400">(optional)</span>
        </label>
        <input
          {...register('addressLine2')}
          placeholder="e.g. Apt 4B, 2nd floor, Near the blue gate"
          className={inputCls()}
        />
      </div>

      {/* City + Region */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>City</label>
          <input
            {...register('city')}
            placeholder="City"
            className={inputCls(!!errors.city)}
          />
          {errors.city && <p className={errorCls}>{errors.city.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Region</label>
          <input
            {...register('region')}
            placeholder="Region"
            className={inputCls(!!errors.region)}
          />
          {errors.region && <p className={errorCls}>{errors.region.message}</p>}
        </div>
      </div>

      {/* Delivery instructions */}
      <div>
        <label className={labelCls}>
          Delivery Instructions{' '}
          <span className="normal-case tracking-normal font-normal text-zinc-400">(optional)</span>
        </label>
        <textarea
          {...register('deliveryInstructions')}
          rows={3}
          placeholder="e.g. Call when arriving, green gate on the left, leave with security…"
          className={`${inputCls()} resize-none`}
        />
      </div>

      {/* Set as default */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          {...register('isDefault')}
          className="w-4 h-4 cursor-pointer"
        />
        <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
          Set as default delivery address
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex rounded-md items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold tracking-widest px-6 py-3.5 transition-colors duration-150"
      >
        {isLoading && <Loader2 size={15} className="animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}