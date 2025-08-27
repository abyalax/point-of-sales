export function produce<T extends object>(state: T, cooking: (draft: T) => void): T {
  const draft = structuredClone(state); // ✅ deep clone
  cooking(draft); // ✅ memasak object
  return draft;
}

export function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export type ExtractString<T> = T extends object ? { [K in keyof T]: ExtractString<T[K]> }[keyof T] : T;

export function generateYearRange(range: number = 5): string[] {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - range;

  const years: string[] = [];
  for (let y = startYear; y <= currentYear; y++) {
    years.push(y.toString());
  }
  return years;
}
