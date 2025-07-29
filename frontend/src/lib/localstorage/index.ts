export const LocalStorage = {
  get: (key: string) => JSON.parse(localStorage.getItem(key) || '{}'),
  set: (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (key: string) => localStorage.removeItem(key),
};
