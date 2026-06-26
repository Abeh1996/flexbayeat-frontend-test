// src/features/Rider/components/RiderRegistrationForm.tsx
'use client';
import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Upload, FileText, X, Bike, Car, Truck, Bus } from 'lucide-react';
import { RiderProfilePayload, VehicleType } from '../types';

const VEHICLE_OPTIONS: { value: VehicleType; label: string; icon: typeof Bike }[] = [
  { value: 'BICYCLE', label: 'Bicycle', icon: Bike },
  { value: 'MOTORCYCLE', label: 'Motorcycle', icon: Bike },
  { value: 'CAR', label: 'Car', icon: Car },
  { value: 'VAN', label: 'Van', icon: Truck },
];

const schema = z.object({
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'VAN'], {
    required_error: 'Select a vehicle type',
  }),
  vehiclePlate: z.string().min(1, 'Vehicle plate number is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  nationalId: z
    .instanceof(File)
    .refine((f) => f.size > 0, 'National ID document is required'),
  license: z
    .instanceof(File)
    .refine((f) => f.size > 0, "Driver's license is required"),
});

type FormValues = z.infer<typeof schema>;

const inputCls = (err?: boolean) =>
  `w-full px-4 py-3 bg-white border text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors duration-150 ${
    err ? 'border-red-400 focus:border-red-400' : 'border-zinc-200 focus:border-amber-500'
  }`;
const labelCls = 'block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5';
const errorCls = 'text-xs text-red-500 font-medium mt-1';

interface RiderRegistrationFormProps {
  onSuccess: (payload: RiderProfilePayload) => void;
  isLoading: boolean;
}

export function RiderRegistrationForm({ onSuccess, isLoading }: RiderRegistrationFormProps) {
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const nationalIdRef = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const selectedVehicle = watch('vehicleType');

  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue('nationalId', file, { shouldValidate: true });
    setNationalIdFile(file);
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue('license', file, { shouldValidate: true });
    setLicenseFile(file);
  };

  const onSubmit = (values: FormValues) => {
    onSuccess({
      vehicleType: values.vehicleType,
      vehiclePlate: values.vehiclePlate,
      vehicleModel: values.vehicleModel,
      nationalId: values.nationalId,
      license: values.license,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ── Vehicle Type ── */}
      <div>
        <label className={labelCls}>
          Vehicle Type <span className="text-red-400">*</span>
        </label>
        <Controller
          name="vehicleType"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VEHICLE_OPTIONS.map((option) => {
                const isSelected = field.value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={`flex flex-col items-center gap-2 px-3 py-4 border-2 transition-colors ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <option.icon
                      size={20}
                      className={isSelected ? 'text-amber-500' : 'text-zinc-400'}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-amber-700' : 'text-zinc-600'
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.vehicleType && <p className={errorCls}>{errors.vehicleType.message}</p>}
      </div>

      {/* ── Vehicle Details ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>
            Plate Number <span className="text-red-400">*</span>
          </label>
          <input
            {...register('vehiclePlate')}
            placeholder="e.g. LT 123 AB"
            className={inputCls(!!errors.vehiclePlate)}
          />
          {errors.vehiclePlate && <p className={errorCls}>{errors.vehiclePlate.message}</p>}
        </div>
        <div>
          <label className={labelCls}>
            Vehicle Model <span className="text-red-400">*</span>
          </label>
          <input
            {...register('vehicleModel')}
            placeholder="e.g. Honda CB125"
            className={inputCls(!!errors.vehicleModel)}
          />
          {errors.vehicleModel && <p className={errorCls}>{errors.vehicleModel.message}</p>}
        </div>
      </div>

      {/* ── National ID ── */}
      <div>
        <label className={labelCls}>
          National ID Document <span className="text-red-400">*</span>
        </label>
        <div
          onClick={() => nationalIdRef.current?.click()}
          className={`border-2 border-dashed cursor-pointer transition-colors flex items-center gap-3 px-4 py-3.5 ${
            errors.nationalId ? 'border-red-300 bg-red-50' : 'border-zinc-200 hover:border-amber-400 bg-zinc-50'
          }`}
        >
          <FileText size={18} className={nationalIdFile ? 'text-amber-500' : 'text-zinc-400'} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-700 truncate">
              {nationalIdFile ? nationalIdFile.name : 'Upload national ID'}
            </p>
            <p className="text-xs text-zinc-400">
              {nationalIdFile ? 'Click to change' : 'Photo or scan of your national ID card'}
            </p>
          </div>
          {nationalIdFile && <Upload size={14} className="text-zinc-300 shrink-0" />}
        </div>
        <input
          ref={nationalIdRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleNationalIdChange}
        />
        {errors.nationalId && <p className={errorCls}>{errors.nationalId.message as string}</p>}
      </div>

      {/* ── Driver's License ── */}
      <div>
        <label className={labelCls}>
          Drivers License <span className="text-red-400">*</span>
        </label>
        <div
          onClick={() => licenseRef.current?.click()}
          className={`border-2 border-dashed cursor-pointer transition-colors flex items-center gap-3 px-4 py-3.5 ${
            errors.license ? 'border-red-300 bg-red-50' : 'border-zinc-200 hover:border-amber-400 bg-zinc-50'
          }`}
        >
          <FileText size={18} className={licenseFile ? 'text-amber-500' : 'text-zinc-400'} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-700 truncate">
              {licenseFile ? licenseFile.name : "Upload driver's license"}
            </p>
            <p className="text-xs text-zinc-400">
              {licenseFile ? 'Click to change' : 'Photo or scan of your valid license'}
            </p>
          </div>
          {licenseFile && <Upload size={14} className="text-zinc-300 shrink-0" />}
        </div>
        <input
          ref={licenseRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleLicenseChange}
        />
        {errors.license && <p className={errorCls}>{errors.license.message as string}</p>}
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