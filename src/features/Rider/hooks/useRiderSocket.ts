// src/features/Rider/hooks/useRiderSocket.ts
'use client';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket, disconnectSocket } from '@/lib/socket';
import type { Socket } from 'socket.io-client';

/**
 * Listens to rider-related socket.io events and invalidates
 * relevant React Query caches so the UI stays in sync.
 *
 * Events (from backend):
 *   delivery.accepted       — rider accepted a task
 *   delivery.declined       — rider declined / auto-declined
 *   delivery.status.updated — status changed (PICKED_UP, OUT_FOR_DELIVERY, etc.)
 *   delivery.completed      — delivery finished
 *   delivery.picked_up      — items collected from vendor
 *   escrow.release          — payment released
 *   rider.location.updated  — rider GPS broadcast
 */
export function useRiderSocket() {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const invalidate = (...keys: string[][]) => {
      keys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    };

    // ── Delivery accepted ──────────────────────────────────────────────────
    const onAccepted = () => {
      invalidate(
        ['rider-available-deliveries'],
        ['rider-assigned-deliveries'],
      );
    };

    // ── Delivery declined ──────────────────────────────────────────────────
    const onDeclined = () => {
      invalidate(['rider-available-deliveries']);
    };

    // ── Status updated ─────────────────────────────────────────────────────
    const onStatusUpdated = () => {
      invalidate(['rider-assigned-deliveries'], ['rider-available-deliveries']);
    };

    // ── Delivery completed ─────────────────────────────────────────────────
    const onCompleted = () => {
      invalidate(
        ['rider-assigned-deliveries'],
        ['rider-available-deliveries'],
      );
    };

    // ── Picked up ──────────────────────────────────────────────────────────
    const onPickedUp = () => {
      invalidate(['rider-assigned-deliveries']);
    };

    socket.on('delivery.accepted', onAccepted);
    socket.on('delivery.declined', onDeclined);
    socket.on('delivery.status.updated', onStatusUpdated);
    socket.on('delivery.completed', onCompleted);
    socket.on('delivery.picked_up', onPickedUp);

    return () => {
      socket.off('delivery.accepted', onAccepted);
      socket.off('delivery.declined', onDeclined);
      socket.off('delivery.status.updated', onStatusUpdated);
      socket.off('delivery.completed', onCompleted);
      socket.off('delivery.picked_up', onPickedUp);
      socketRef.current = null;
    };
  }, [queryClient]);

  return { socket: socketRef.current };
}