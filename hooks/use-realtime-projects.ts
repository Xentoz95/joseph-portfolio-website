/**
 * Real-time Projects Hook
 *
 * Subscribes to Supabase real-time updates for the projects table.
 * Provides optimistic UI updates and handles connection states.
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimePayload } from '@/types/database';
import { throttle } from '@/lib/utils/debounce';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface UseRealtimeProjectsOptions {
  /**
   * Enable real-time updates
   * @default true
   */
  enabled?: boolean;
  /**
   * Throttle updates to prevent excessive re-renders (in milliseconds)
   * @default 500
   */
  throttleMs?: number;
  /**
   * Callback when connection status changes
   */
  onStatusChange?: (status: ConnectionStatus) => void;
}

export interface UseRealtimeProjectsResult {
  /**
   * Current connection status
   */
  status: ConnectionStatus;
  /**
   * Latest update timestamp
   */
  lastUpdate: Date | null;
  /**
   * Whether an update is currently being processed
   */
  isUpdating: boolean;
  /**
   * Reconnect to real-time subscription
   */
  reconnect: () => void;
  /**
   * Disconnect from real-time subscription
   */
  disconnect: () => void;
}

/**
 * Hook for real-time projects updates
 *
 * @param options - Configuration options
 * @returns Real-time state and control functions
 *
 * @example
 * ```tsx
 * function ProjectsPage() {
 *   const { status, lastUpdate } = useRealtimeProjects();
 *
 *   return (
 *     <div>
 *       <ConnectionStatus status={status} />
 *       {lastUpdate && <span>Updated: {lastUpdate.toLocaleTimeString()}</span>}
 *       {/* Projects rendered here *\/}
 *     </div>
 *   );
 * }
 * ```
 */
export function useRealtimeProjects(
  options: UseRealtimeProjectsOptions = {}
): UseRealtimeProjectsResult {
  const {
    enabled = true,
    throttleMs = 500,
    onStatusChange,
  } = options;

  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const subscriptionRef = useRef<RealtimeChannel | null>(null);
  const supabase = createClient();
  const mountedRef = useRef(true);

  // Handle status changes with callback
  const handleStatusChange = useCallback((newStatus: ConnectionStatus) => {
    if (!mountedRef.current) return;

    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  // Throttled update handler to prevent excessive re-renders
  const handleUpdate = useCallback(
    throttle(() => {
      if (!mountedRef.current) return;

      setIsUpdating(true);
      setLastUpdate(new Date());

      // Trigger a revalidation of the Next.js cache
      // This will cause server components to re-fetch data
      fetch('/api/revalidate?tag=projects', { method: 'POST' }).catch(() => {
        // Silently fail - revalidation is optional
      });

      setTimeout(() => {
        if (mountedRef.current) {
          setIsUpdating(false);
        }
      }, 300);
    }, throttleMs),
    [throttleMs]
  );

  // Subscribe to real-time updates
  const subscribe = useCallback(() => {
    if (!enabled || subscriptionRef.current) return;

    handleStatusChange('connecting');

    const channel = supabase
      .channel('realtime-projects')
      .on(
        'postgres_changes' as const,
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          console.log('[Realtime] Projects update:', payload.eventType, payload);

          // Handle different payload types
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
            handleUpdate();
          }
        }
      )
      .subscribe((status) => {
        if (!mountedRef.current) return;

        switch (status) {
          case 'SUBSCRIBED':
            handleStatusChange('connected');
            break;
          case 'CLOSED':
          case 'CHANNEL_ERROR':
            handleStatusChange('disconnected');
            break;
          default:
            break;
        }
      });

    subscriptionRef.current = channel;
  }, [enabled, supabase, handleUpdate, handleStatusChange]);

  // Unsubscribe from real-time updates
  const unsubscribe = useCallback(() => {
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }
    if (mountedRef.current) {
      handleStatusChange('disconnected');
    }
  }, [supabase, handleStatusChange]);

  // Manual reconnect
  const reconnect = useCallback(() => {
    unsubscribe();
    subscribe();
  }, [unsubscribe, subscribe]);

  // Manual disconnect
  const disconnect = useCallback(() => {
    unsubscribe();
  }, [unsubscribe]);

  // Set up subscription on mount
  useEffect(() => {
    if (enabled) {
      subscribe();
    }

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [enabled, subscribe, unsubscribe]);

  return {
    status,
    lastUpdate,
    isUpdating,
    reconnect,
    disconnect,
  };
}
