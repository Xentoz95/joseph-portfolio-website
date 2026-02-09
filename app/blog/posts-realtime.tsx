/**
 * Real-time wrapper component for Blog page
 *
 * Client component that manages real-time subscriptions
 * and displays connection status.
 */

'use client';

import { useRealtimePosts } from '@/hooks/use-realtime-posts';
import { ConnectionStatus, ConnectionStatusDot } from '@/components/connection-status';

export function PostsRealtimeWrapper() {
  const { status, lastUpdate, reconnect } = useRealtimePosts({
    enabled: true,
    throttleMs: 500,
  });

  return (
    <div className="flex items-center gap-3">
      <ConnectionStatus
        status={status}
        lastUpdate={lastUpdate}
        onReconnect={reconnect}
      />
    </div>
  );
}

/**
 * Compact version - shows just the dot
 * Can be used in tight spaces like navigation
 */
export function PostsRealtimeDot() {
  const { status } = useRealtimePosts({
    enabled: true,
    throttleMs: 500,
  });

  return <ConnectionStatusDot status={status} />;
}
