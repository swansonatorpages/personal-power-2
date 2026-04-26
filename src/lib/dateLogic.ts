/**
 * Calculates the "effective" date and time based on a custom cutoff time.
 * If the current time is BEFORE the cutoff time (and the cutoff is considered "late night"),
 * we attribute the current time to the *previous* calendar day.
 * 
 * Example: Cutoff is "03:00" (3 AM). 
 * If it's Tuesday 2:00 AM, the effective day is still Monday.
 * If it's Tuesday 4:00 AM, the effective day is Tuesday.
 * 
 * @param dateObj The real Date object
 * @param cutoffTime A string in "HH:mm" format (24-hour)
 * @returns A new Date object representing the logical day (time reset to 00:00:00)
 */
export function getLogicalDate(dateObj: Date, cutoffTime: string): Date {
  const [cutoffHourStr, cutoffMinStr] = cutoffTime.split(':');
  const cutoffHour = parseInt(cutoffHourStr, 10);
  const cutoffMin = parseInt(cutoffMinStr, 10);

  const currentHour = dateObj.getHours();
  const currentMin = dateObj.getMinutes();

  const logicalDate = new Date(dateObj);
  logicalDate.setHours(0, 0, 0, 0); // Normalize to start of day

  // If the cutoff is early morning (e.g., 00:00 to 06:00)
  // and we haven't reached it yet, we are still on the previous logical day.
  if (cutoffHour < 12) {
    if (currentHour < cutoffHour || (currentHour === cutoffHour && currentMin < cutoffMin)) {
      logicalDate.setDate(logicalDate.getDate() - 1);
    }
  }

  // NOTE: If cutoff is late evening (e.g., 23:00), we don't shift the day backwards if we are before it.
  // The early morning cutoff logic (03:00) is the standard for habits like 75 Hard.
  
  return logicalDate;
}

/**
 * Returns a YYYY-MM-DD string for a given Date
 */
export function toISODateString(dateObj: Date): string {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

/**
 * Calculates the current day number of the program (1-30) based on start date.
 */
export function getEffectiveProgramDay(now: Date, cutoffTime: string, startDateStr: string | null): number {
  if (!startDateStr) return 1;

  const logicalNow = getLogicalDate(now, cutoffTime);
  const logicalNowTime = logicalNow.getTime();

  // Parse start date, assuming it was saved as YYYY-MM-DD
  const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
  const startDate = new Date(sYear, sMonth - 1, sDay);
  startDate.setHours(0, 0, 0, 0);

  const diffTime = logicalNowTime - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Day 1 is the start date (diffDays = 0).
  const programDay = diffDays + 1;

  // Cap between 1 and 30, or let it exceed if you want post-program tracking.
  // For now, we just return the calculated day.
  return programDay;
}
