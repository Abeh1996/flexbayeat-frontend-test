// src/features/Rider/hooks/useRiderLocation.ts
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useRiderMutation } from './useRiderMutation';

export type GpsStatus = 'idle' | 'tracking' | 'error' | 'denied' | 'unsupported';

export interface RiderCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number | null;
  heading?: number | null;
}

export interface UseRiderLocationReturn {
  gpsStatus: GpsStatus;
  lastPosition: RiderCoords | null;
  /** Force an immediate one-shot position fix and send to backend. */
  refresh: () => void;
  /** Whether a manual location update is in flight. */
  isUpdating: boolean;
}

/**
 * Silently watches the rider's GPS position and sends updates to the
 * backend via PATCH /user/rider/location every ~5 seconds.
 *
 * Starts when the component mounts, stops when it unmounts.
 * No user-facing toggle — just background location tracking.
 *
 * Exposes `refresh()` for manual one-shot fixes (e.g. the settings page).
 */
export function useRiderLocation(): UseRiderLocationReturn {
  const { updateLocation } = useRiderMutation();
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle');
  const [lastPosition, setLastPosition] = useState<RiderCoords | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const watchId = useRef<number | null>(null);
  const lastSent = useRef<number>(0);
  const intervalMs = 5000;
  const mounted = useRef(true);

  /** Backend rejects `accuracy` — only send lat/lng/speed/heading. */
  const toPayload = (pos: RiderCoords) => ({
    latitude: pos.latitude,
    longitude: pos.longitude,
    speed: pos.speed ?? undefined,
    heading: pos.heading ?? undefined,
  });

  const sendLocation = useCallback(
    (pos: RiderCoords) => {
      const now = Date.now();
      if (now - lastSent.current < intervalMs) return;
      lastSent.current = now;
      updateLocation(toPayload(pos));
    },
    [updateLocation],
  );

  /** One-shot position fix with user-visible feedback. */
  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('GPS not available', { description: 'Your device does not support geolocation.' });
      return;
    }
    setIsUpdating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mounted.current) return;
        const coords: RiderCoords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
        };
        setLastPosition(coords);
        setGpsStatus('tracking');
        lastSent.current = 0;
        updateLocation(toPayload(coords));
        lastSent.current = Date.now();
        setIsUpdating(false);
        toast.success('Location updated', { duration: 3000 });
      },
      (err) => {
        if (!mounted.current) return;
        setIsUpdating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus('denied');
          toast.error('GPS permission denied', {
            description: 'Enable location access in your browser settings.',
          });
        } else {
          setGpsStatus('error');
          toast.error('GPS fix failed', {
            description: 'Could not get a location. Try moving to an open area.',
          });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [updateLocation]);

  useEffect(() => {
    mounted.current = true;

    if (!navigator.geolocation) {
      setGpsStatus('unsupported');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        if (!mounted.current) return;
        const coords: RiderCoords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
        };
        setLastPosition(coords);
        setGpsStatus('tracking');
        sendLocation(coords);
      },
      (err) => {
        if (!mounted.current) return;
        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus('denied');
        } else {
          setGpsStatus('error');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      },
    );

    watchId.current = id;

    return () => {
      mounted.current = false;
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [sendLocation]);

  return { gpsStatus, lastPosition, refresh, isUpdating };
}