export function produce<T extends object>(state: T, cooking: (draft: T) => void): T {
  const draft = structuredClone(state); // ✅ deep clone
  cooking(draft); // ✅ memasak object
  return draft;
}
