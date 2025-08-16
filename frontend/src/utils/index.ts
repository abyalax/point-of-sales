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
