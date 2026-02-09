/**
 * Debounce utility functions
 *
 * Prevents excessive function calls by delaying execution
 * until a specified time has passed without new calls.
 */

/**
 * Creates a debounced version of a function
 *
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}

/**
 * Creates a debounced async function
 *
 * @param func - The async function to debounce
 * @param wait - The delay in milliseconds
 * @returns A debounced version of the async function
 */
export function debounceAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingPromise: Promise<unknown> | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      pendingPromise = func(...args);
      await pendingPromise;
      timeoutId = null;
      pendingPromise = null;
    }, wait);
  };
}

/**
 * Creates a throttled version of a function
 * Unlike debounce, throttle ensures the function runs at most once per wait period
 *
 * @param func - The function to throttle
 * @param wait - The delay in milliseconds
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, wait);
    } else {
      lastArgs = args;
    }
  };
}
