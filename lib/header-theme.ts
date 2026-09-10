/** Internal headers mix 75% Experience green with 25% former graphite; canvas/theme follow. */
export const headerColors = { dark: '#141913', warm: '#311500' } as const;
export const headerTone = (edition: string, page: string) =>
  edition === 'immersive' || page === 'home' ? 'warm' : 'dark';
export const headerColor = (edition: string, page: string) =>
  headerColors[headerTone(edition, page)];
