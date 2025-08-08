/**
 * Removes all diacritics (accents) from a string
 * Useful for accent-insensitive searching in Vietnamese
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
} 