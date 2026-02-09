/**
 * Real-time wrapper component for Projects page
 *
 * Client component that manages real-time subscriptions
 * and displays connection status.
 */

'use client';

import { useRealtimeProjects } from '@/hooks/use-realtime-projects';
import { ConnectionStatus, ConnectionStatusDot } from '@/components/connection-status';

export function ProjectsRealtimeWrapper() {
  const { status, lastUpdate, reconnect } = useRealtimeProjects({
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
export function ProjectsRealtimeDot() {
  const { status } = useRealtimeProjects({
    enabled: true,
    throttleMs: 500,
  });

  return <ConnectionStatusDot status={status} />;
}
