/**
 * pwa.ts
 * PWA utility helpers — install prompt handling, update detection, offline status.
 */

/* ── Install prompt ─────────────────────────────────────────────── */

let _deferredPrompt: Event | null = null;

export function capturePWAInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    _deferredPrompt = e;
  });
}

export function canShowInstallPrompt(): boolean {
  return _deferredPrompt !== null;
}

export async function triggerInstallPrompt(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!_deferredPrompt) return 'unavailable';
  // @ts-ignore — non-standard API
  _deferredPrompt.prompt();
  // @ts-ignore
  const { outcome } = await _deferredPrompt.userChoice;
  _deferredPrompt = null;
  return outcome === 'accepted' ? 'accepted' : 'dismissed';
}

/* ── Standalone detection ───────────────────────────────────────── */

export function isRunningStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-ignore — iOS Safari
    (window.navigator as any).standalone === true
  );
}

/* ── Offline detection ──────────────────────────────────────────── */

export function isOnline(): boolean {
  return navigator.onLine;
}

export function onOnlineStatusChange(cb: (online: boolean) => void): () => void {
  const handleOnline  = () => cb(true);
  const handleOffline = () => cb(false);
  window.addEventListener('online',  handleOnline);
  window.addEventListener('offline', handleOffline);
  return () => {
    window.removeEventListener('online',  handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/* ── Notification permission ────────────────────────────────────── */

export type NotifPermission = 'granted' | 'denied' | 'default' | 'unsupported';

export function getNotificationPermission(): NotifPermission {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotifPermission> {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  const result = await Notification.requestPermission();
  return result;
}

/* ── Schedule a local reminder (best-effort) ────────────────────── */
export function scheduleLocalReminder(timeStr: string): void {
  // Bare minimum: save to localStorage so main.tsx can read at startup
  localStorage.setItem('pp2_reminder_time', timeStr);
}

export function getScheduledReminderTime(): string | null {
  return localStorage.getItem('pp2_reminder_time');
}

export function clearScheduledReminder(): void {
  localStorage.removeItem('pp2_reminder_time');
}
