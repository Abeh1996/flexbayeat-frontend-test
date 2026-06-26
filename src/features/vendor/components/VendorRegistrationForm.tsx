// src/features/Vendor/components/VendorRegistrationForm.tsx
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Search,
  LocateFixed,
  Loader2,
  X,
  MapPin,
  Upload,
  FileText,
  ImageIcon,
} from 'lucide-react';
import { VendorProfilePayload } from '../types';

const GEO_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

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
    lat: number;
    lon: number;
  };
}

const schema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  logo: z
    .instanceof(File)
    .refine((f) => f.size > 0, 'Logo is required')
    .refine((f) => f.type.startsWith('image/'), 'Must be an image file'),
  documents: z
    .array(z.instanceof(File))
    .min(1, 'At least one document is required'),
});

type FormValues = z.infer<typeof schema>;

const inputCls = (err?: boolean) =>
  `w-full px-4 py-3 bg-white border text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors duration-150 ${
    err ? 'border-red-400 focus:border-red-400' : 'border-zinc-200 focus:border-amber-500'
  }`;
const labelCls = 'block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5';
const errorCls = 'text-xs text-red-500 font-medium mt-1';

interface VendorRegistrationFormProps {
  onSuccess: (payload: VendorProfilePayload) => void;
  isLoading: boolean;
}

export function VendorRegistrationForm({ onSuccess, isLoading }: VendorRegistrationFormProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const docsInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
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
    if (value.length < 3 || !GEO_KEY) { setSuggestions([]); return; }
    setIsFetchingSuggestions(true);
    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&filter=countrycode:cm&limit=5&lang=en&apiKey=${GEO_KEY}`;
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
    const addressLine1 =
      [p.housenumber, p.street].filter(Boolean).join(' ') ||
      p.name ||
      p.suburb ||
      p.formatted.split(',')[0];
    setValue('addressLine1', addressLine1);
    setValue('city', p.city ?? '');
    setValue('region', p.state ?? '');
    setValue('latitude', p.lat);
    setValue('longitude', p.lon);
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
    setValue('latitude', undefined);
    setValue('longitude', undefined);
  };

  const handleDetect = () => {
    if (!navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: detLat, longitude: detLng } = pos.coords;
        try {
          const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${detLat}&lon=${detLng}&lang=en&apiKey=${GEO_KEY}`;
          const res = await fetch(url);
          const data = await res.json();
          const feature: GeoapifyFeature | undefined = data.features?.[0];
          if (feature) handleSelectSuggestion(feature);
          else {
            setValue('latitude', detLat);
            setValue('longitude', detLng);
          }
        } catch {
          setValue('latitude', detLat);
          setValue('longitude', detLng);
        } finally {
          setIsDetecting(false);
        }
      },
      () => setIsDetecting(false),
      { timeout: 10000 }
    );
  };

  // Logo handler
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue('logo', file, { shouldValidate: true });
    setLogoPreview(URL.createObjectURL(file));
  };

  // Documents handler
  const handleDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const merged = [...docFiles, ...files];
    setDocFiles(merged);
    setValue('documents', merged, { shouldValidate: true });
  };

  const removeDoc = (index: number) => {
    const updated = docFiles.filter((_, i) => i !== index);
    setDocFiles(updated);
    setValue('documents', updated, { shouldValidate: true });
  };

  const onSubmit = (values: FormValues) => {
    onSuccess({
      businessName: values.businessName,
      description: values.description,
      phone: values.phone,
      email: values.email || undefined,
      addressLine1: values.addressLine1,
      city: values.city,
      region: values.region,
      latitude: values.latitude,
      longitude: values.longitude,
      logo: values.logo,
      documents: values.documents,
    });
  };

  const mapPreviewUrl =
    lat && lng
      ? `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=200&center=lonlat:${lng},${lat}&zoom=14&marker=lonlat:${lng},${lat};color:%23f59e0b;size:medium&apiKey=${GEO_KEY}`
      : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ── Business Info ── */}
      <div>
        <p className={`${labelCls} text-zinc-400 mb-3`}>Business Information</p>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>
              Business Name <span className="text-red-400">*</span>
            </label>
            <input
              {...register('businessName')}
              placeholder="e.g. Mama Ngozi Kitchen"
              className={inputCls(!!errors.businessName)}
            />
            {errors.businessName && <p className={errorCls}>{errors.businessName.message}</p>}
          </div>

          <div>
            <label className={labelCls}>
              Description{' '}
              <span className="normal-case tracking-normal font-normal text-zinc-400">(optional)</span>
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Tell customers what your business is about…"
              className={`${inputCls()} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>
                Phone{' '}
                <span className="normal-case tracking-normal font-normal text-zinc-400">(optional)</span>
              </label>
              <input
                {...register('phone')}
                placeholder="+237 6XX XXX XXX"
                className={inputCls()}
              />
            </div>
            <div>
              <label className={labelCls}>
                Email{' '}
                <span className="normal-case tracking-normal font-normal text-zinc-400">(optional)</span>
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="business@email.com"
                className={inputCls(!!errors.email)}
              />
              {errors.email && <p className={errorCls}>{errors.email.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Logo ── */}
      <div>
        <p className={`${labelCls} text-zinc-400 mb-3`}>Business Logo</p>
        <div
          onClick={() => logoInputRef.current?.click()}
          className={`border-2 border-dashed cursor-pointer transition-colors flex items-center gap-4 px-5 py-4 ${
            errors.logo ? 'border-red-300 bg-red-50' : 'border-zinc-200 hover:border-amber-400 bg-zinc-50'
          }`}
        >
          {logoPreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoPreview}
                alt="Logo preview"
                className="w-14 h-14 object-cover border border-zinc-200"
              />
              <div>
                <p className="text-sm font-semibold text-zinc-700">Logo selected</p>
                <p className="text-xs text-zinc-400 mt-0.5">Click to change</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-zinc-100 flex items-center justify-center shrink-0">
                <ImageIcon size={22} className="text-zinc-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-700">Upload business logo</p>
                <p className="text-xs text-zinc-400 mt-0.5">PNG, JPG, WEBP — images only</p>
              </div>
            </>
          )}
        </div>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
        {errors.logo && <p className={errorCls}>{errors.logo.message as string}</p>}
      </div>

      {/* ── Documents ── */}
      <div>
        <p className={`${labelCls} text-zinc-400 mb-3`}>Verification Documents</p>
        <p className="text-xs text-zinc-500 mb-3">
          Upload business registration certificate, ID, or any document that verifies your business.
        </p>

        {/* Uploaded docs list */}
        {docFiles.length > 0 && (
          <div className="space-y-2 mb-3">
            {docFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 px-4 py-2.5 bg-zinc-50 border border-zinc-200"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={14} className="text-amber-500 shrink-0" />
                  <span className="text-xs text-zinc-700 truncate">{file.name}</span>
                  <span className="text-xs text-zinc-400 shrink-0">
                    ({(file.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeDoc(index)}
                  className="text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => docsInputRef.current?.click()}
          className={`w-full flex items-center justify-center gap-2 border-2 border-dashed px-5 py-4 text-sm font-semibold transition-colors ${
            errors.documents
              ? 'border-red-300 text-red-400 bg-red-50'
              : 'border-zinc-200 text-zinc-500 hover:border-amber-400 hover:text-amber-500 bg-zinc-50'
          }`}
        >
          <Upload size={15} />
          {docFiles.length > 0 ? 'Add more documents' : 'Upload documents'}
        </button>
        <input
          ref={docsInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleDocsChange}
        />
        {errors.documents && (
          <p className={errorCls}>{errors.documents.message as string}</p>
        )}
      </div>

      {/* ── Business Location ── */}
      <div>
        <p className={`${labelCls} text-zinc-400 mb-3`}>Business Location</p>
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className={labelCls}>Search Address</label>
            <div className="relative" ref={suggestionsRef}>
              <div className="relative flex items-center">
                <Search size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                <input
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="Search street, neighbourhood, city…"
                  className={`${inputCls()} pl-10 pr-20`}
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {query && (
                    <button type="button" onClick={clearSearch} className="p-1.5 text-zinc-400 hover:text-zinc-600">
                      <X size={13} />
                    </button>
                  )}
                  {isFetchingSuggestions && <Loader2 size={14} className="text-zinc-400 animate-spin" />}
                  <button
                    type="button"
                    onClick={handleDetect}
                    disabled={isDetecting}
                    title="Detect my location"
                    className="p-1.5 text-zinc-400 hover:text-amber-500 transition-colors disabled:opacity-40"
                  >
                    {isDetecting ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
                  </button>
                </div>
              </div>

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
          </div>

          {/* Map preview */}
          {showMap && mapPreviewUrl && (
            <div className="border border-zinc-200 overflow-hidden">
              <div className="px-3 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center gap-2">
                <MapPin size={12} className="text-amber-500" />
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Location Preview
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mapPreviewUrl} alt="Map preview" className="w-full h-40 object-cover" />
            </div>
          )}

          {/* City + Region */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>City</label>
              <input {...register('city')} placeholder="City" className={inputCls()} />
            </div>
            <div>
              <label className={labelCls}>Region</label>
              <input {...register('region')} placeholder="Region" className={inputCls()} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-widest px-6 py-3.5 transition-colors duration-150"
      >
        {isLoading && <Loader2 size={15} className="animate-spin" />}
        Submit Application
      </button>
    </form>
  );
}