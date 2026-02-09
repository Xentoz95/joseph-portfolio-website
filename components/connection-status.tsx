/**
 * Connection Status Component
 *
 * Displays the current real-time connection state with visual indicators.
 */

'use client';

import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectionStatus as Status } from '@/hooks/use-realtime-projects';
import { cn } from '@/lib/utils';

export interface ConnectionStatusProps {
  /**
   * Current connection status
   */
  status: Status;
  /**
   * Last update timestamp
   */
  lastUpdate: Date | null;
  /**
   * Custom className for styling
   */
  className?: string;
  /**
   * Whether to show the reconnect button when disconnected
   * @default true
   */
  showReconnect?: boolean;
  /**
   * Callback when reconnect is clicked
   */
  onReconnect?: () => void;
}

const statusConfig = {
  connecting: {
    icon: Loader2,
    label: 'Connecting...',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    animate: true,
  },
  connected: {
    icon: Wifi,
    label: 'Live',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    animate: false,
  },
  disconnected: {
    icon: WifiOff,
    label: 'Disconnected',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
    animate: false,
  },
  error: {
    icon: AlertCircle,
    label: 'Connection Error',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/20',
    animate: false,
  },
};

/**
 * Connection status indicator component
 *
 * Displays a visual indicator of the real-time connection state
 * with optional reconnect button.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { status, lastUpdate, reconnect } = useRealtimeProjects();
 *
 *   return (
 *     <ConnectionStatus
 *       status={status}
 *       lastUpdate={lastUpdate}
 *       onReconnect={reconnect}
 *     />
 *   );
 * }
 * ```
 */
export function ConnectionStatus({
  status,
  lastUpdate,
  className,
  showReconnect = true,
  onReconnect,
}: ConnectionStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-200',
        config.bgColor,
        config.borderColor,
        config.color,
        className
      )}
      title={config.label}
    >
      <Icon
        className={cn(
          'w-4 h-4',
          config.animate && 'animate-spin'
        )}
      />
      <span>{config.label}</span>

      {lastUpdate && (
        <span
          className={cn(
            'text-xs opacity-70',
            'hidden sm:inline'
          )}
        >
          · Updated {formatLastUpdate(lastUpdate)}
        </span>
      )}

      {(status === 'disconnected' || status === 'error') && showReconnect && onReconnect && (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 ml-1 text-xs hover:underline"
          onClick={onReconnect}
        >
          Reconnect
        </Button>
      )}
    </div>
  );
}

/**
 * Format the last update timestamp for display
 */
function formatLastUpdate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}

/**
 * Compact version of connection status
 * Shows only the icon with a tooltip
 */
export interface ConnectionStatusDotProps {
  status: Status;
  className?: string;
}

export function ConnectionStatusDot({ status, className }: ConnectionStatusDotProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'w-2 h-2 rounded-full',
        config.bgColor,
        config.color.replace('text-', 'bg-'),
        status === 'connecting' && 'animate-pulse',
        className
      )}
      title={config.label}
    />
  );
}
